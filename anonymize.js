#!/usr/bin/env node

const linereader = require("line-reader")

let first = null
const launches = []

linereader.eachLine("./logs/launches.txt", (line) => {

  const [,
    date,
    ip,
    action,
    payload,
  ] = line.match(
    /^([^,]+),([^,]*),([^,]+),([^}]+\})/
  )

  let time
  if (!first) {
    first = new Date(date)
    time = 0
  } else {
    time = (new Date(date)) - first
  }

  const { origin, target } = JSON.parse(payload)
  let [lat1, lon1] = origin
  let [lat2, lon2] = target

  lat1 = Math.round(lat1)
  lat2 = Math.round(lat2)
  lon1 = Math.round(lon1)
  lon2 = Math.round(lon2)

  const missile = {
    // date,
    time,
    lat1,
    lon1,
    lat2,
    lon2,
  }

  launches.push(missile)

  if (launches.length >= 1000) {
    console.log(
      JSON.stringify(
        launches,
        undefined,
        2
      )
    )
    return false
  }
})

