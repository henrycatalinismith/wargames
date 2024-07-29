#!/usr/bin/env node

const linereader = require("line-reader")

let launches = []

linereader.eachLine(process.stdin, (line, last) => {

  const [,
    date,
    ip,
    action,
    payload,
  ] = line.match(
    /^([^,]+),([^,]*),([^,]+),([^}]+\})/
  )

  const { origin, target } = JSON.parse(payload)
  let [lat1, lon1] = origin
  let [lat2, lon2] = target

  lat1 = Math.round(lat1)
  lat2 = Math.round(lat2)
  lon1 = Math.round(lon1)
  lon2 = Math.round(lon2)

  const missile = [
    lat1,
    lon1,
    lat2,
    lon2,
  ]

  launches = launches.concat(missile)

  if (last) {
    console.log(
      JSON.stringify(
        launches,
        // undefined,
        // 2,
      )
    )
  }
})

