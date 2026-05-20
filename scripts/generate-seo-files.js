const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const publicDir = path.join(__dirname, '../public');
const siteUrl = (process.env.SITE_URL || pkg.homepage || 'https://neurowebcr.com').replace(/\/+$/, '');
const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>
  <url>
    <loc>${siteUrl}/en/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="es" href="${siteUrl}/" />
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />
  </url>
</urlset>
`;

const sitemapXsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Sitemap - NeuroWebCR</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; color: #111; }
          table { border-collapse: collapse; width: 100%; max-width: 980px; }
          th, td { border: 1px solid #ddd; padding: 0.65rem; text-align: left; font-size: 14px; }
          th { background: #f5f5f5; }
          h1 { margin: 0 0 1rem 0; }
        </style>
      </head>
      <body>
        <h1>Sitemap URLs</h1>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Last Modified</th>
              <th>Changefreq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sm:urlset/sm:url">
              <tr>
                <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:lastmod"/></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td><xsl:value-of select="sm:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap.xsl'), sitemapXsl);
console.log('SEO files generated in public/: robots.txt, sitemap.xml');
