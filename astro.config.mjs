import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import swup from "@swup/astro";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://descartesdemo.netlify.app",
  base: "/",
  integrations: [
    swup({
      theme: ["overlay", { direction: "to-top" }],
      cache: true,
      progress: true,
    }),
    preact(),
    sitemap({
      // 站点地图配置选项
      filter: (page) => {
        // 排除特定页面（如管理页面、草稿等）
        const excludePaths = ['/admin', '/draft', '/private', '/test'];
        const excludePatterns = [
          /\.(jpg|jpeg|png|gif|svg|ico|css|js|woff|woff2|ttf|eot)$/i,
          /\/sitemap-.*\.xml$/i,
          /\/robots\.txt$/i
        ];

        // 检查是否包含排除路径
        const hasExcludedPath = excludePaths.some(path => page.includes(path));
        // 检查是否匹配排除模式
        const matchesExcludedPattern = excludePatterns.some(pattern => pattern.test(page));

        return !hasExcludedPath && !matchesExcludedPattern;
      },

      // 序列化选项 - 自定义输出格式
      serialize: (item) => {
        return {
          url: item.url,
          lastmod: item.lastmod,
          changefreq: item.changefreq || 'weekly',
          priority: item.priority || 0.5,
        };
      },

      // 站点地图样式表
      // xsl: '/sitemap-style.xsl',

      // 启用地域化支持（如果需要）
      // i18n: {
      //   defaultLocale: 'zh-CN',
      //   locales: {
      //     'zh-CN': 'zh-CN',
      //     'en-US': 'en-US'
      //   }
      // }
    }),
  ],

  image: {
    responsiveStyles: true,
    // csdn图片防止403错误
    domains: ['i-blog.csdnimg.cn'],
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/csdn-img': {
          target: 'https://i-blog.csdnimg.cn',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/csdn-img/, ''),
        },
      },
    },
  },

  experimental: {
    svgo: true,
  },
});

//swup theme variations:
// theme: "fade"
// theme: ["overlay", { direction: "to-top"}]
//
// for overlay and fade, further customization can be done in animate.css file
// To know about swup, visit https://swup.js.org/