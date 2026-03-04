<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
                xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
                xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title>站点地图 - Descartes Blog</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 30px;
          }
          
          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }
          
          .stats {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;
          }
          
          .stat-item {
            text-align: center;
          }
          
          .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #3498db;
            display: block;
          }
          
          .stat-label {
            color: #7f8c8d;
            font-size: 0.9em;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          
          th {
            background: #34495e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          
          td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
          }
          
          tr:hover {
            background-color: #f8f9fa;
          }
          
          .url {
            color: #2980b9;
            text-decoration: none;
            word-break: break-all;
          }
          
          .url:hover {
            text-decoration: underline;
            color: #3498db;
          }
          
          .priority {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 500;
          }
          
          .priority-high {
            background: #e8f5e8;
            color: #27ae60;
          }
          
          .priority-medium {
            background: #fff3cd;
            color: #f39c12;
          }
          
          .priority-low {
            background: #f8d7da;
            color: #e74c3c;
          }
          
          .changefreq {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            background: #e3f2fd;
            color: #1976d2;
          }
          
          .lastmod {
            color: #7f8c8d;
            font-size: 0.9em;
          }
          
          .header-info {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 20px;
            color: #0c5460;
          }
          
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
            color: #7f8c8d;
            font-size: 0.9em;
          }
          
          @media (max-width: 768px) {
            .container {
              padding: 20px;
              margin: 10px;
            }
            
            .stats {
              gap: 15px;
              padding: 15px;
            }
            
            table {
              font-size: 0.9em;
            }
            
            th, td {
              padding: 8px;
            }
          }
        </style>
      </head>
      
      <body>
        <div class="container">
          <h1>🗺️ 站点地图 - Descartes Blog</h1>
          
          <div class="header-info">
            <strong>ℹ️ 这是什么？</strong> 这是本网站的XML站点地图的HTML可视化版本，
            旨在帮助搜索引擎更好地理解和索引网站内容，同时也方便用户浏览网站结构。
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <span class="stat-number"><xsl:value-of select="count(//sitemap:url)"/></span>
              <span class="stat-label">总页面数</span>
            </div>
            <div class="stat-item">
              <span class="stat-number"><xsl:value-of select="count(//sitemap:url[sitemap:priority &gt; 0.8])"/></span>
              <span class="stat-label">高优先级页面</span>
            </div>
            <div class="stat-item">
              <span class="stat-number"><xsl:value-of select="count(//sitemap:url[sitemap:changefreq = 'daily'])"/></span>
              <span class="stat-label">每日更新页面</span>
            </div>
            <div class="stat-item">
              <span class="stat-number"><xsl:value-of select="count(//image:image)"/></span>
              <span class="stat-label">图片资源</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>页面URL</th>
                <th>优先级</th>
                <th>更新频率</th>
                <th>最后修改</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="//sitemap:url">
                <xsl:sort select="sitemap:priority" order="descending"/>
                <tr>
                  <td>
                    <a class="url" href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt; 0.8">
                        <span class="priority priority-high">高</span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt; 0.5">
                        <span class="priority priority-medium">中</span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low">低</span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td>
                    <span class="changefreq">
                      <xsl:value-of select="sitemap:changefreq"/>
                    </span>
                  </td>
                  <td class="lastmod">
                    <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
          
          <div class="footer">
            <p>📅 生成时间：<xsl:value-of select="current-dateTime()"/></p>
            <p>🌐 本站点地图由 Astro Sitemap 插件自动生成</p>
            <p>🔗 原始XML文件：<a href="/sitemap-index.xml">sitemap-index.xml</a></p>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>