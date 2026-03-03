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
  website: "https://descartesdemo.netlify.app",
  title: "DescartesZ",
  description: "一个记录个人学习、思考、分享的博客",
  image: {
    src: "/space-ahead-preview.jpeg",
    alt: "个人博客图",
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
      text: "Github",
      href: "https://github.com/DescartesZ",
    },
    {
      text: "Gitee",
      href: "https://gitee.com/plan-001/projects",
    },
    {
      text: "CSDN",
      href: "https://blog.csdn.net/qq_45020145?type=blog",
    },
  ],
  hero: {
    eyebrowText: "无限探索",
    title: "无垠空间✨",
    text: "不积硅步，无以至千里。不积小流，无以成江海。终有一天, 你将进入新的无垠空间。",
    image: {
      src: "/assets/images/pixeltrue-space-discovery.svg",
      alt: "A person sitting at a desk in front of a computer",
    },
    actions: [
      {
        text: "立即阅读",
        href: withBase("/blog"),
      },
      // {
      //   text: "Subscribe",
      //   href: "#subscribe",
      // },
    ],
  },
  about: {
    title: "关于",
    text: "这个博客当前尚处开发阶段，我还无法定义这个博客的用途，目前主要是用来整理一些过去的积累，以及一些学习笔记。等到合适的时候，会再给这个博客一个属于它的定义。",
  },
  contactInfo: {
    title: "联系我",
    text: "您好！无论您对我、对博客、对博文有任何问题、建议，还是想分享您的想法，我都乐意倾听。",
    promote:
      "另外，如果您有web系统开发或者App、微信小程序等需求需要寻求合作,也欢迎联系我深入合作。请随时通过以下任何方式联系我：",
    email: {
      text: "这是我的电子邮件，我会尽快回复:",
      href: "mailto:zhouzhihuis@qq.com",
      email: "zhouzhihuis@qq.com",
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
  // 订阅模块
  // subscribe: {
  //   title: "Subscribe to Space Ahead",
  //   text: "One update per week. All the latest stories in your inbox.",
  //   formUrl: "#",
  // },
  blog: {
    description: "无限探索 无限进步",
  },
  postsPerPage: 5,
  recentPostLimit: 3,
};

export default siteConfig;
