import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export const AUTHENTICATE = false
export const CORS = false

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".csv": "text/csv",
  ".pdf": "application/pdf",
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const folder = path.basename((req.params as any).folder || "")
  const file = path.basename((req.params as any).file || "")

  if (!file) {
    return res.status(400).send("File name is required")
  }

  const candidatePaths = [
    path.resolve(process.cwd(), "static", folder, file),
    path.resolve(process.cwd(), "public", folder, file),
    path.resolve(process.cwd(), folder, file),
    path.resolve(__dirname, "../../../../static", folder, file),
  ]

  let resolvedFile: string | null = null
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      resolvedFile = candidate
      break
    }
  }

  if (!resolvedFile) {
    return res.status(404).send(`Cannot find static file: ${folder}/${file}`)
  }

  const ext = path.extname(file).toLowerCase()
  const contentType = MIME_TYPES[ext] || "application/octet-stream"

  res.setHeader("Content-Type", contentType)
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  res.setHeader("Access-Control-Allow-Origin", "*")

  const stream = fs.createReadStream(resolvedFile)
  stream.on("error", () => {
    res.status(500).send("Error reading file")
  })
  stream.pipe(res)
}
