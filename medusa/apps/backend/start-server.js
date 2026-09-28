const { spawn } = require("child_process")

const port = process.env.PORT || "9000"
const host = process.env.HOST || "0.0.0.0"

console.log(`[TamZen Backend] Launching Medusa server on ${host}:${port}...`)
console.log(`[TamZen Backend] DATABASE_URL: ${process.env.DATABASE_URL ? "FOUND (" + process.env.DATABASE_URL.split("@")[1] + ")" : "NOT FOUND / MISSING"}`)
console.log(`[TamZen Backend] REDIS_URL: ${process.env.REDIS_URL ? "FOUND" : "NOT FOUND / MISSING"}`)

const child = spawn("npx", ["medusa", "start", "-H", host, "-p", String(port)], {
  stdio: "inherit",
  shell: true,
  env: process.env,
})

child.on("exit", (code) => {
  console.log(`[TamZen Backend] Process exited with code ${code}`)
  process.exit(code || 0)
})

process.on("SIGINT", () => child.kill("SIGINT"))
process.on("SIGTERM", () => child.kill("SIGTERM"))
