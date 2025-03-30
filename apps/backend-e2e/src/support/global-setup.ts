import { spawn } from 'child_process'

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n')

  // Start the API server
  const server = spawn('nx', ['dev', 'backend'], {
    shell: true,
    //stdio: 'inherit',
    stdio: 'pipe',
  })
  // Store the server process in globalThis so it can be accessed in globalTeardown
  globalThis.__SERVER_PROCESS__ = server

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n'

  // You might want to wait for the server to be fully up before proceeding
  // This is a simplistic approach; consider polling a health endpoint instead
  await new Promise((resolve) => setTimeout(resolve, 5000))
}
