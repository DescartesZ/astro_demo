<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
  <html lang="zh-CN">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>XML Sitemap — 无垠空间</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
          background: linear-gradient(180deg, #fdfcfb 0%, #295eac 120%);
          background-attachment: fixed;
          color: #1a1a1a;
          min-height: 100vh;
        }
        h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .subtitle {
          text-align: center;
          color: #555;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 1.5rem;
        }
        th, td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        th {
          background: rgba(41, 94, 172, 0.1);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #295eac;
        }
        td { font-size: 0.9rem; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(41, 94, 172, 0.04); }
        a { color: #295eac; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .url { color: #666; font-size: 0.85rem; word-break: break-all; }
        .priority { text-align: center; width: 80px; }
        .badge {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .badge-high { background: #d4edda; color: #155724; }
        .badge-mid { background: #fff3cd; color: #856404; }
        .badge-low { background: #f8d7da; color: #721c24; }
        .footer {
          text-align: center;
          color: #888;
          font-size: 0.8rem;
          margin-top: 1.5rem;
        }
        .footer a { color: #295eac; }
        @media (prefers-color-scheme: dark) {
          body {
            background: linear-gradient(to bottom, #434343 0%, #000 100%);
            color: #e0e0e0;
          }
          table { background: rgba(30,30,30,0.8); }
          th { background: rgba(255,255,133,0.1); color: #ffff85; }
          tr:hover td { background: rgba(255,255,133,0.05); }
          td { border-color: rgba(255,255,255,0.06); }
          a { color: #ffff85; }
          .badge-high { background: rgba(21,87,36,0.5); color: #5adb7a; }
          .badge-mid { background: rgba(133,100,4,0.5); color: #ffc107; }
          .badge-low { background: rgba(114,28,36,0.5); color: #f5c6cb; }
          .url { color: #aaa; }
          .subtitle, .footer { color: #999; }
        }
      </style>
    </head>
    <body>
      <h1>🗺️ XML 站点地图</h1>
      <p class="subtitle">无垠空间 (DescartesZ) — 搜索引擎索引文件</p>

      <xsl:choose>
        <!-- sitemapindex -->
        <xsl:when test="/sitemap:sitemapindex">
          <table>
            <thead><tr><th>#</th><th>站点地图文件</th><th>URL</th></tr></thead>
            <tbody>
              <xsl:for-each select="/sitemap:sitemapindex/sitemap:sitemap">
                <tr>
                  <td style="width:40px;text-align:center"><xsl:value-of select="position()"/></td>
                  <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                  <td class="url"><xsl:value-of select="sitemap:loc"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:when>

        <!-- urlset -->
        <xsl:when test="/sitemap:urlset">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>页面 URL</th>
                <th class="priority">优先级</th>
                <th>更新频率</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="/sitemap:urlset/sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending" data-type="number"/>
                <tr>
                  <td style="width:40px;text-align:center"><xsl:value-of select="position()"/></td>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td class="priority">
                    <xsl:choose>
                      <xsl:when test="sitemap:priority >= 0.8">
                        <span class="badge badge-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority >= 0.5">
                        <span class="badge badge-mid"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="badge badge-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </xsl:when>

        <xsl:otherwise>
          <p>未知的站点地图格式。</p>
        </xsl:otherwise>
      </xsl:choose>

      <div class="footer">
        <p>由 <a href="https://github.com/withastro/astro">Astro</a> + <a href="https://github.com/withastro/astro/tree/main/packages/integrations/sitemap">@astrojs/sitemap</a> 生成</p>
      </div>
    </body>
  </html>
</xsl:template>
</xsl:stylesheet>
