export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/login",
          "/register",
          "/journal/admin",
        ],
      },
    ],
    sitemap: "https://diarynity.com/sitemap.xml",
  };
}