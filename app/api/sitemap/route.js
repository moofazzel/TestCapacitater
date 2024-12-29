import { NextResponse } from "next/server";

// Function to handle the sitemap generation
export async function GET() {
  const urls = [
    { loc: "https://capacitater.com/", changefreq: "daily", priority: "1.0" },
    {
      loc: "https://capacitater.com/contact",
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      loc: "https://capacitater.com/privacy-policy",
      changefreq: "yearly",
      priority: "0.5",
    },
  ];

  // Generate XML for the sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (url) => `
        <url>
          <loc>${url.loc}</loc>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>`
        )
        .join("")}
    </urlset>
  `;

  // Return the generated sitemap XML as a response
  const response = new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });

  return response;
}
