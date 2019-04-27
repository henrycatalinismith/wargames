const fs = require("fs")
const http = require("http")
const serveStatic = require("serve-static")
const url = require("url")
const uuid = require("uuid")


const { WebClient } = require("@slack/client")
const { createEventAdapter } = require("@slack/events-api")

try {
  fs.symlinkSync(__dirname, `${__dirname}/pages`)
} catch (e) {
  // probably just already exists lololol
}

const express = require("express")()
const next = require("next")({
  dev: true,
  dir: __dirname,
})

const server = http.createServer(express)
const io = require("socket.io")(server)

const slack = new WebClient(process.env.SLACK_ACCESS_TOKEN)
const events = createEventAdapter(process.env.SLACK_SIGNING_SECRET)

const {
  action,
  before,
  after,
  reducer,
  selector,
  insert,
  remove,} = require("@highvalley.systems/signalbox")
const redux = require("redux")

const actions = {
  ...action("listen", ["port"]),
  ...action("connect", ["player"]),
  ...action("disconnect", ["player"]),
  ...action("target", ["player", "origin", "target"]),
  ...action("launch", ["player", "origin", "target"]),
}


console.log("lol")
console.log(insert)
console.log(remove)
const reducers = redux.combineReducers({
  players: reducer({}, {
    connect: insert("player"),
    disconnect: remove("player"),
  }),
})

const say = message => {
  slack.chat.postMessage({
    channel: "wopr",
    text: message,
  })
}


const middlewares = redux.applyMiddleware.apply(null, [
  after(/.*/, (store, action) => {
    console.log([
      `[${(new Date).toISOString()}]`,
      `${action.type}`,
    ].join(" "))
  }),
  
  before("listen", (store, { port} ) => new Promise(resolve => {
    server.listen(port, () => resolve())
  })),
  
  after("target", (store, action) => {
    store.dispatch(actions.launch(action.player, action.origin, action.target))
  }),
  
  after("launch", (store, action) => {
    io.emit("launch", action)
  })
])

const store = redux.createStore(reducers, {}, middlewares)

io.on("connection", socket => {
  const id = uuid()
  const player = { id }
  store.dispatch(actions.connect(player))

  socket.on("target", data => {
    store.dispatch(actions.target(player, data.origin, data.target))
  })
  
  socket.on("disconnect", () => {
    store.dispatch(actions.disconnect(player))
  })
})

express.get("/", (req, res) => next.render(req, res, "/falken"))
express.use("/slack/events", events.expressMiddleware())
express.use("/", next.getRequestHandler())

events.on("error", e => {
  console.log("slack events error!")
  console.log(e)
})

events.on("message", message => {
  console.log(message)
  
  if (!message.subtype && message.text.match(/^beep$/)) {
    slack.chat.postMessage({
      channel: message.channel,
      text: "boopss",
    })
  }
})

next.prepare().then(() => {
  store.dispatch(actions.listen(process.env.PORT || 3000))
})
