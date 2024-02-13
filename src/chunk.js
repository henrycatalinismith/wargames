#!/usr/bin/env node

const cp = require("child_process")

function run (cmd) {
  cp.execSync(cmd, { stdio: "inherit" })
}

function get(cmd) {
  return cp
    .execSync(cmd, { stdio: "pipe" })
    .toString()
    .trim()
}

const filename = "logs/launches.txt"
const directory = "missiles"
const launchCount = parseInt(get(`wc -l ${filename}`))
const chunkSize = Math.pow(2, 14)
const chunkCount = Math.ceil(launchCount / chunkSize)

console.log({
  launchCount,
  chunkSize,
  chunkCount,
})

for (let i = 0; i < chunkCount; i++) {
  console.log(i)

  const start = i * chunkSize
  const end = start + chunkSize

  const cmd = [
    `tail -n +${start + 1} ${filename}`,
    `head -n ${chunkSize}`,
    `node src/anonymize.js > ${directory}/${i.toString().padStart(3, "0")}.json`
  ].join(" | ")

  console.log({ start, end, cmd })
  run(cmd)

}


