const request = require('request')
const { spawn } = require('child_process')

const antaniURL = `https://www.antanipsum.it/antani.php?h1=0&h2=0&h3=0&h4=0&h5=0&h6=0&tags=0&n=2&size=m`

request(antaniURL, function(error, response, body) {
  if (error) {
    console.error(`AntanIpsum: ${error}`)
  }

  let content = body.split('<p>').join('').split('</p>').join('')
  // console.log(content)

  const pbcopy = spawn('xclip', ['-selection', 'clipboard'])
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

