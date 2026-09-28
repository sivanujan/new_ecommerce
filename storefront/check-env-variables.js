const requiredEnvs = [
  {
    key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
    description:
      "Learn how to create a publishable key: https://docs.medusajs.com/v2/resources/storefront-development/publishable-api-keys",
  },
]

const DEFAULT_PUBLISHABLE_KEY =
  "pk_91653d23759694260c03c3c9398f37e499d37e3e255b59e60e26a65fbd9c77b0"

function checkEnvVariables() {
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = DEFAULT_PUBLISHABLE_KEY
    console.log("[Info] Using default publishable key for build:", DEFAULT_PUBLISHABLE_KEY)
  }

  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.warn("\n[Warning] Missing required environment variables:")
    missingEnvs.forEach(function (env) {
      console.warn(`  - ${env.key}: ${env.description || ""}`)
    })
  }
}

module.exports = checkEnvVariables

