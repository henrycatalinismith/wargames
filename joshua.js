const fs = require("fs")
const http = require("http")
const uuid = require("uuid")

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

const action = (type, args = []) => ({
  [type]: (...argv) => ({
    type,
    ...argv.reduce((acc, curr) => {
      acc[args[Object.values(acc).length]] = curr
      return acc
    }, {})
  })
})

const before = (actionType, handler) => store => next => action => {
  if (action.type.match(actionType)) {
    return Promise
      .resolve(handler.call(null, store, action))
      .then(ret => ret !== false && next(action))
  }
  return next(action)
}

const reducer = (initialState, actions) => (state, action) => {
  switch (true) {
    case state === undefined:
      return initialState
    case actions.hasOwnProperty(action.type):
      return actions[action.type](state, action)
    default:
      return state
  }
}

const after = (actionType, handler) => store => next => action => {
  const result = next(action)
  if (action.type.match(actionType)) {
    handler.call(null, store, action)
  }
  return result
}

const insert = entityName => (entityState, action) => ({
  ...entityState,
  [action[entityName].id]: action[entityName],
})

const replace = entityName => (entityState, action) => action[entityName]

const update = entityName => (entityState, action) => ({
  ...entityState,
  ...action[entityName],
})

const remove = entityName => (entityState, action) => {
  const { [action[entityName].id]: deleted, ...remaining } = entityState
  return remaining
}

const fifo = entityName => ([forgotten, ...remaining], action) => [
  ...remaining,
  action[entityName],
]

const redux = require("redux")

const actions = {
  ...action("listen", ["port"]),
  ...action("connect", ["player"]),
  ...action("disconnect", ["player"]),
  ...action("target", ["player", "origin", "target"]),
  ...action("launch", ["player", "origin", "target"]),
}


const reducers = redux.combineReducers({
  players: reducer({}, {
    connect: insert("player"),
    disconnect: remove("player"),
  }),
})

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
express.use("/", next.getRequestHandler())

next.prepare().then(() => {
  store.dispatch(actions.listen(process.env.PORT || 3000))
})

