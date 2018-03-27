#!/usr/bin/env node

const request = require('request')
const os = require('os')
const { spawn } = require('child_process')
const program = require('commander')
const htmlToText = require('html-to-text')

program
  .version('0.1.0')
  .option('-o, --stdout', 'print text result to stdout')
  .parse(process.argv)

const antaniURL = `https://www.antanipsum.it/antani.php?h0=1&h2=0&h3=0&h4=0&h5=0&h6=0&tags=0&n=1&size=xl`

request(antaniURL, function(error, response, body) {
  if (error) {
    console.error(`AntanIpsum: ${error}`)
  }

  let content = htmlToText.fromString(body, {
    wordwrap: null,
  })

  const osType = os.type()
  if (['Linux', 'Darwin'].indexOf(osType) < 0 || program.stdout) {
    console.log(content)
    process.exit(0)
  }

  const pbcopy = osType === 'Linux' ? spawn('xclip', ['-selection', 'clipboard']) : spawn('pbcopy')
  pbcopy.stdin.write(content)

  pbcopy.stderr.on('data', function(data) {
    console.error(data)
  })

  pbcopy.on('close', code => {
    if (code !== 0) {
      console.info(`pbcopy process exited with code ${code}`)
    }
  })

  process.exit(0)
})
