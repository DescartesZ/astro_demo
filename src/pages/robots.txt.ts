import type { APIRoute } from 'astro';
import { withBase } from '../utils/helpers';

const getRobotsTxt = (sitemapURL: string) => `# robots.txt - Descartes Blog
# 搜索引擎爬虫配置文件

# 允许所有爬虫访问
User-agent: *
Allow: /

# 站点地图位置
Sitemap: ${sitemapURL}

# 禁止访问的路径
Disallow: /admin/
Disallow: /private/
Disallow: /draft/
Disallow: /test/
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.css$
Disallow: /*.js$
Disallow: /*.woff$
Disallow: /*.woff2$
Disallow: /*.ttf$
Disallow: /*.eot$

# 爬虫访问延迟（避免过度请求）
Crawl-delay: 1

# 特定爬虫配置
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: bingbot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: Yandex
Allow: /
Crawl-delay: 2
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL(withBase('/sitemap-index.xml'), site).href;
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
