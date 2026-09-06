module.exports = async function () {
  // Put clean up logic here (e.g. stopping services, docker-compose, etc.).
  // Hint: `globalThis` is shared between setup and teardown.
  console.log(globalThis.__TEARDOWN_MESSAGE__)

  // Stop the server process initiated in globalSetup
  if (globalThis.__SERVER_PROCESS__) {
    const server = globalThis.__SERVER_PROCESS__

    if (server.exitCode === null) {
      server.kill()
      await new Promise<void>((resolve) => server.once('exit', resolve))
    }
  }
}
