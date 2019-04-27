/* global google */

const {
  action,
  before,
  after,
  reducer,
  insert,
  update,
  remove,
  fifo,
} = require("@highvalley.systems/signalbox")

const React = require("react")
const ReactRedux = require("react-redux")
const redux = require("redux")
const Head = require("next/head").default
const io = require("socket.io-client")
const uuid = require("uuid")

let socket

const actions = {
  ...action("pageLoad"),
  ...action("loadGoogleMaps"),
  ...action("connect"),
  ...action("tick", ["time"]),
  ...action("target", ["origin", "target"]),
  ...action("launch", ["origin", "target"]),
  ...action("detonate", ["missile"]),
  ...action("disperse", ["explosion"]),
  ...action("decay", ["fallout"]),
}
                                                          
const reducers = redux.combineReducers({
  explosions: reducer({}, {
    detonate: insert("explosion"),
    disperse: remove("explosion"),
  }),

  fallout: reducer({}, {
    tick: update("fallout"),
    decay: remove("fallout"),
  }),

  googleMaps: reducer(
    {
      loaded: !!(
        typeof window !== "undefined" // server-side
        && window.google && window.google.maps // client-side
      ),
      key: process.env.GMAPS_API_KEY,
    }, {
      loadGoogleMaps: update("googleMaps"),
    }
  ),

  frames: reducer(
    Array(3).fill({
      count: 0,
      time: new Date,
      interval: NaN,
    }), {fronte
    tick: fifo("frame"),
  }),

  missiles: reducer({}, {
    launch: insert("missile"),
    tick: update("missiles"),
    detonate: remove("missile"),
  }),
})

const middlewares = redux.applyMiddleware.apply(null, [
  after(/^(?!tick|decay$)/, (store, action) => {
    console.groupCollapsed(
      [`%c[${(new Date).toISOString()}]`, `%c${action.type}`].join(" "),
      "color: #c2c3c7",
      "color: #ee74a7",
    )
    console.log(action)
    console.groupEnd()
  }),

  after("pageLoad", () => store.dispatch(actions.connect())),
  after("pageLoad", () => store.dispatch(actions.loadGoogleMaps())),
  
  before("connect", () => socket = io()),

  after("connect", store => {
    socket.on("launch", action => store.dispatch(action))
  }),

  after("target", (store, action) => socket.emit("target", action)),

  before("launch", (store, action) => {
    const { googleMaps } = store.getState()
    const origin = new google.maps.LatLng(action.origin.latitude, action.origin.longitude)
    const target = new google.maps.LatLng(action.target.latitude, action.target.longitude)
    const heading = google.maps.geometry.spherical.computeHeading(origin, target)
    action.missile = {
      id: uuid(),
      location: origin,
      heading,
      origin,
      target,
    }
  }),

  before("loadGoogleMaps", (store, action) => new Promise((resolve) => {
    const { googleMaps } = store.getState()

    if (window.google || googleMaps.loaded) {
      return resolve()
    }

    const mapElement = document.querySelector(".map__element")

    window.unleash_hell = window.google ? () => {} : () => {
      action.googleMaps = {
        loaded: true,
      }

      delete window.unleash_hell
      resolve()
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?${[
      `key=${googleMaps.key}`,
      `libraries=geometry,visualization`,
      `callback=unleash_hell`,
    ].join("&")}`

    document.body.appendChild(script)
  })),


  after("loadGoogleMaps", store => {
    store.dispatch(actions.tick(new Date))
  }),

  before("tick", (store, action) => {
    const state = store.getState()
    const { explosions, fallout, frames, missiles } = state

    const frame = {
      count: frames[frames.length - 1].count + 1,
      time: action.time,
      interval: action.time - frames[frames.length - 1].time,
    }

    const speed = 0.00000008
    const distance = speed * frame.time
    for (const id in missiles) {
      missiles[id].heading = google.maps.geometry.spherical.computeHeading(
        missiles[id].location,
        missiles[id].target
      )
      missiles[id].location = google.maps.geometry.spherical.computeOffset(
        missiles[id].location,
        distance,
        missiles[id].heading
      )
    }

    if (frame.count % 2 === 0) {
      for (const eid in explosions) {
        const id = uuid()
        fallout[id] = {
          id,
          time: frame.time,
          location: explosions[eid].location,
          heading: 180 - (Math.random() * 360),
        }
      }
    }

    for (const fid in fallout) {
      if (frame.time - fallout[fid].time > 20000) {
        setImmediate(() => {
          store.dispatch(actions.decay(fallout[fid]))
        })
      } else {
        fallout[fid].location = google.maps.geometry.spherical.computeOffset(
          fallout[fid].location,
          1000,
          fallout[fid].heading
        )
      }
    }

    action.fallout = fallout
    action.frame = frame
    action.missiles = missiles
  }),

  after("tick", (store, action) => {
    const state = store.getState()
    const { fallout, googleMaps, missiles } = state
    for (const id in missiles) {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        missiles[id].location,
        missiles[id].target
      )
      if (distance < 80000) {
        store.dispatch(actions.detonate(missiles[id]))
      }
    }

    requestAnimationFrame(() => {
      store.dispatch(actions.tick(new Date))
    })
  }),

  before("detonate", (store, action) => {
    const { frames } = store.getState()
    const { missile } = action

    action.explosion = {
      id: uuid(),
      time: frames[frames.length-1].time,
      location: missile.target,
    }
  }),

  after("detonate", (store, action) => {
    setTimeout(() => {
      store.dispatch(actions.disperse(action.explosion))
    }, 10000)
  }),

])

const store = redux.createStore(reducers, {}, middlewares)

export default () => {
  React.useEffect(() => {
    store.dispatch(actions.pageLoad())
  }, [])

  return (
    <ReactRedux.Provider store={store}>
      <Header />
      <Stylesheet />
      <Map>
        <Missiles />
        <Explosions />
        <Fallout />
      </Map>
    </ReactRedux.Provider>
  )
}

const Header = () => (
  <Head>
    <title>
      wargames.glitch.me
    </title>
  </Head>
)

const Stylesheet = () => <style global jsx>{`
  html {
    overflow: hidden;
  }

  body {
    font-family: Helvetica;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 85vh;
  }

  .map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`}</style>

const MapContext = React.createContext()

const Map = ReactRedux.connect(
  ({ googleMaps }) => ({ googleMaps })
)(({ googleMaps, children }) => {
  let [map, setMap] = React.useState(undefined)
  const mapElement = React.useRef()
  
  React.useEffect(() => {
    if (!window.google) {
      return
    }
    
    map = map || new google.maps.Map(mapElement.current, {
      center: new google.maps.LatLng(55.3617609, -3.4433238),
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      draggable: true,
      draggableCursor: 'crosshair',
      scrollwheel: true,
      zoom: 2,
      zoomControl: true
    })
    
    google.maps.event.addListener(map, "click", event => {
      const origin = {
        latitude: 0,
        longitude: 0,
      }
      const target = {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      }
      store.dispatch(actions.target(origin, target))
    })
    
    setMap(map)
  }, [googleMaps.loaded])
  
  
  return (
    <MapContext.Provider value={map}>
      <style jsx>{`
        .map__element--loading {
          display: none;
        }
        .map__element--loaded {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
      `}</style>
      <div className="map">
        <div ref={mapElement} className={[
          "map__element",
          !googleMaps.loaded && "map__element--loading",
          googleMaps.loaded && "map__element--loaded",
        ].filter(c => !!c).join(" ")} />
        {googleMaps.loaded && children}
      </div>
    </MapContext.Provider>
  )
})

const Fallout = ReactRedux.connect(
  ({ fallout }) =>
  ({ fallout })
)(({ fallout }) => {
  let [heatmap, setHeatmap] = React.useState(undefined)
  const map = React.useContext(MapContext)

  React.useEffect(() => {
    setHeatmap(new google.maps.visualization.HeatmapLayer({
      data: [],
      dissipating: false,
      opacity: 1,
      radius: 0.8,
      map,
    }))
  }, [])
  
  React.useEffect(() => {
    if (heatmap) {
      heatmap.setMap(map)
    }
  }, [map])
  
  React.useEffect(() => {
    if (heatmap) {
      heatmap.setData(Object.keys(fallout).map(id => fallout[id].location))
    }
  }, [fallout])
  
  return null
})


const Missiles = ReactRedux.connect(
  ({ missiles }) =>
  ({ missiles })
)(({ missiles }) => 
  Object
    .entries(missiles)
    .map(([id, missile]) => <Missile key={id} {...missile} />)
)
  
const Explosions = ReactRedux.connect(
  ({ explosions }) =>
  ({ explosions })
)(({ explosions }) => 
  Object
    .entries(explosions)
    .map(([id, explosion]) => <Explosion key={id} {...explosion} />)
)

const Missile = ({ id, location, origin, target }) => {
  const line = React.useRef()
  const map = React.useContext(MapContext)
  
  React.useEffect(() => {
    line.current = line.current || new google.maps.Polyline({
      geodesic: true,
      clickable: false,
      map: map,
      path: [origin, origin],
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 1
    })
  }, [])

  React.useEffect(() => {
    line.current.setPath([ origin, location ])
  }, [location])

  React.useEffect(() => () => {
    line.current.setMap(null)
  }, [])

  return <></>
}

const Explosion = ({ id, location }) => {
  const circle = React.useRef()
  const map = React.useContext(MapContext)

  React.useEffect(() => {
    circle.current = circle.current || new google.maps.Circle({
      center: location,
      clickable: false,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
      radius: 10000,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
    })

    return () => {
      circle.current.setMap(null)
    }
  }, [])

  return <></>
}

 