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
  const rawFile = (req.params as any).file || ""
  // Sanitize file name to avoid directory traversal
  const fileName = path.basename(rawFile)

  if (!fileName) {
    return res.status(400).send("File name is required")
  }

  // Check potential locations where Medusa or local file provider might store uploaded files
  const candidatePaths = [
    path.resolve(process.cwd(), "static", fileName),
    path.resolve(process.cwd(), "public", fileName),
    path.resolve(process.cwd(), "uploads", fileName),
    path.resolve(__dirname, "../../../static", fileName),
    path.resolve(__dirname, "../../../../static", fileName),
  ]

  let resolvedFile: string | null = null
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      resolvedFile = candidate
      break
    }
  }

  if (!resolvedFile) {
    // If not found on local disk (e.g. Railway ephemeral filesystem reset after restart),
    // respond with 404 and appropriate headers
    return res.status(404).send(`Cannot find static file: ${fileName}`)
  }

  const ext = path.extname(fileName).toLowerCase()
  const contentType = MIME_TYPES[ext] || "application/octet-stream"

  res.setHeader("Content-Type", contentType)
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
  res.setHeader("Access-Control-Allow-Origin", "*")

  const stream = fs.createReadStream(resolvedFile)
  stream.on("error", (err) => {
    res.status(500).send("Error reading file")
  })
  stream.pipe(res)
}
