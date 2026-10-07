const excludedPaths = ["/checkout", "/account/*", "/admin*", "/admin-login"]

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL || "https://tamzen.shop",
  generateRobotsTxt: true,
  exclude: [...excludedPaths, "/[sitemap]"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: excludedPaths,
      },
    ],
  },
}
