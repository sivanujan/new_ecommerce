const { spawn, execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

const port = process.env.PORT || "9000"
const host = process.env.HOST || "0.0.0.0"

console.log(`[TamZen Backend] Launching Medusa server on ${host}:${port}...`)
console.log(`[TamZen Backend] DATABASE_URL: ${process.env.DATABASE_URL ? "FOUND (" + process.env.DATABASE_URL.split("@")[1] + ")" : "NOT FOUND / MISSING"}`)
console.log(`[TamZen Backend] REDIS_URL: ${process.env.REDIS_URL ? "FOUND" : "NOT FOUND / MISSING"}`)

// Ensure public/admin/index.html exists so Medusa never fails
const publicAdminIndex = path.join(__dirname, "public", "admin", "index.html")
const medusaAdminIndex = path.join(__dirname, ".medusa", "server", "public", "admin", "index.html")

if (!fs.existsSync(publicAdminIndex) && fs.existsSync(medusaAdminIndex)) {
  const destDir = path.join(__dirname, "public", "admin")
  fs.mkdirSync(destDir, { recursive: true })
  fs.cpSync(path.join(__dirname, ".medusa", "server", "public", "admin"), destDir, { recursive: true })
  console.log(`[TamZen Backend] Synced compiled admin to public/admin`)
}

console.log(`[TamZen Backend] Admin index.html exists: ${fs.existsSync(publicAdminIndex)}`)

// Automatically audit inventory levels so no item is ever unstocked at checkout
try {
  console.log(`[TamZen Backend] Auditing and stocking inventory levels...`)
  execSync("npx medusa exec ./src/scripts/fix-inventory-levels.ts", { stdio: "inherit" })
} catch (e) {
  console.warn(`[TamZen Backend] Inventory audit completed or skipped:`, e.message)
}

// Automatically ensure TamZen tiered shipping rates are active and up to date
try {
  console.log(`[TamZen Backend] Verifying TamZen shipping rates...`)
  execSync("npx medusa exec ./src/scripts/setup-tamzen-shipping.ts", { stdio: "inherit" })
} catch (e) {
  console.warn(`[TamZen Backend] Shipping setup completed or skipped:`, e.message)
}

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
