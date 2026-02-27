import { withBase } from "./utils/helpers";

export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Hero = {
  eyebrowText?: string;
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};

export type About = {
  title?: string;
  text?: string;
};

export type Blog = {
  description?: string;
};

export type ContactInfo = {
  title?: string;
  text?: string;
  email?: {
    text?: string;
    href?: string;
    email?: string;
  };
  socialProfiles?: {
    text?: string;
    href?: string;
  }[];
};

export type Subscribe = {
  title?: string;
  text?: string;
  formUrl: string;
};

export type SiteConfig = {
  website: string;
  logo?: Image;
  title: string;
  description: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  about?: About;
  contactInfo?: ContactInfo;
  subscribe?: Subscribe;
  blog?: Blog;
  postsPerPage?: number;
  recentPostLimit: number;
  projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
  website: "https://example.com",
  title: "DescartesZ",
  description: "一个使用 Astro.js 和 Tailwind CSS 构建的极简太空风格个人博客",
  image: {
    src: "/space-ahead-preview.jpeg",
    alt: "极简太空风格个人博客",
  },
  headerNavLinks: [
    {
      text: "主页",
      href: withBase("/"),
    },
    {
      text: "博客",
      href: withBase("/blog"),
    },
    {
      text: "标签",
      href: withBase("/tags"),
    },
    {
      text: "关于",
      href: withBase("/about"),
    },
    {
      text: "联系",
      href: withBase("/contact"),
    },
  ],
  footerNavLinks: [
    {
      text: "关于",
      href: withBase("/about"),
    },
    {
      text: "联系",
      href: withBase("/contact"),
    },
    {
      text: "RSS 订阅",
      href: withBase("/rss.xml"),
    },
    {
      text: "站点地图",
      href: withBase("/sitemap-index.xml"),
    },
  ],
  socialLinks: [
    {
      text: "Dribbble",
      href: "https://dribbble.com/",
    },
    {
      text: "Instagram",
      href: "https://instagram.com/",
    },
    {
      text: "X/Twitter",
      href: "https://twitter.com/",
    },
  ],
  hero: {
    eyebrowText: "无限探索",
    title: "无垠空间✨",
    text: "Written by Astro-naut Sid, a space explorer at Beyond Earth.",
    image: {
      src: "/assets/images/pixeltrue-space-discovery.svg",
      alt: "A person sitting at a desk in front of a computer",
    },
    actions: [
      {
        text: "立即阅读",
        href: withBase("/blog"),
      },
      {
        text: "Subscribe",
        href: "#subscribe",
      },
    ],
  },
  about: {
    title: "About",
    text: "Space Ahead is a blog about space exploration and travel. It is written by Astro-naut Sid, a space explorer at Beyond Earth. Sid is known for his love of adventure and his insatiable curiosity about the universe. He has explored countless planets, discovered new life forms, and made friends with aliens along the way. 🚀",
  },
  contactInfo: {
    title: "Contact",
    text: "Hi! Whether you have a question, a suggestion, or just want to share your thoughts, I'm all ears. Feel free to get in touch through any of the methods below:",
    email: {
      text: "Drop me an email and I’ll do my best to respond as soon as possible.",
      href: "mailto:example@example.com",
      email: "example@example.com",
    },
    socialProfiles: [
      {
        text: "LinkedIn",
        href: "https://www.linkedin.com/",
      },
      {
        text: "Peerlist",
        href: "https://www.peerlist.io/",
      },
      {
        text: "GitHub",
        href: "https://github.com/",
      },
    ],
  },
  subscribe: {
    title: "Subscribe to Space Ahead",
    text: "One update per week. All the latest stories in your inbox.",
    formUrl: "#",
  },
  blog: {
    description:
      "Read about my space adventures, explorations and the aliens I've met on my journeys.",
  },
  postsPerPage: 5,
  recentPostLimit: 3,
};

export default siteConfig;
