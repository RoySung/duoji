import { spawn } from 'child_process'

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string

module.exports = async function () {
  console.log('\nSetting up...\n')

  const server = spawn('nx', ['dev', 'backend'], {
    shell: true,
    stdio: 'pipe',
  })

  // Wait for server to be ready by listening to stdout
  await new Promise((resolve, reject) => {
    server.stdout.on('data', (data) => {
      const output = data.toString()
      // console.log(output)
      // Adjust this condition based on your server's actual startup message
      if (output.includes('Application is running')) {
        resolve(true)
      }
    })

    server.stderr.on('data', (data) => {
      console.error(`Error: ${data.toString()}`)
    })

    // Add timeout just in case
    setTimeout(() => {
      reject(new Error('Server failed to start within 30 seconds'))
    }, 30000)
  })

  globalThis.__SERVER_PROCESS__ = server
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n'
}
