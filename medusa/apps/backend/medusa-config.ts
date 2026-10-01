import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "https://tamzen.shop,http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "*",
      authCors: process.env.AUTH_CORS || "https://tamzen.shop,http://localhost:8000",
      jwtSecret: process.env.JWT_SECRET || "dev_tamzen_jwt_secret_production_2026_fallback",
      cookieSecret: process.env.COOKIE_SECRET || "dev_tamzen_cookie_secret_production_2026_fallback",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { redisUrl: process.env.REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: { redis: { redisUrl: process.env.REDIS_URL } },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Stripe Payment Provider - active whenever STRIPE_API_KEY is defined in .env
          ...(process.env.STRIPE_API_KEY
            ? [
                {
                  resolve: "@medusajs/medusa/payment-stripe",
                  id: "stripe",
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                  },
                },
              ]
            : []),
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              backend_url: `${(process.env.MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/\/+$/, "")}/static`,
            },
          },
        ],
      },
    },
  ],
})
