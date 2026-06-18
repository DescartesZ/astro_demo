import siteConfig from '../site.config';

/**
 * 生成 Website Schema (适用于首页)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '无垠空间',
    alternateName: siteConfig.title,
    url: siteConfig.website,
    description: siteConfig.description,
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.website}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成 Blog Schema (适用于博客列表页)
 */
export function generateBlogSchema(postCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '无垠空间 - 博客',
    description: siteConfig.blog?.description || siteConfig.description,
    url: `${siteConfig.website}/blog`,
    inLanguage: 'zh-CN',
    author: {
      '@type': 'Person',
      name: 'DescartesZ',
      url: siteConfig.website,
    },
    numberOfItems: postCount,
  };
}

interface ArticleSchemaParams {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedDate: Date;
  modifiedDate?: Date;
  authorName?: string;
  tags?: string[];
}

/**
 * 生成 BlogPosting Schema (适用于单篇博客文章)
 */
export function generateArticleSchema(params: ArticleSchemaParams) {
  const {
    title,
    description,
    url,
    image,
    publishedDate,
    modifiedDate,
    authorName = 'DescartesZ',
    tags = [],
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    url: url,
    ...(image && {
      image: image.startsWith('http')
        ? image
        : `${siteConfig.website}${image.startsWith('/') ? '' : '/'}${image}`,
    }),
    datePublished: publishedDate.toISOString(),
    ...(modifiedDate && { dateModified: modifiedDate.toISOString() }),
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteConfig.website,
    },
    publisher: {
      '@type': 'Person',
      name: 'DescartesZ',
    },
    inLanguage: 'zh-CN',
    ...(tags.length > 0 && { keywords: tags.join(', ') }),
    isAccessibleForFree: true,
    license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  };
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * 生成 BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * 生成 Person Schema (适用于关于页面)
 */
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'DescartesZ',
    url: siteConfig.website,
    description: siteConfig.about?.text || siteConfig.description,
    sameAs: siteConfig.socialLinks?.map((link) => link.href) || [],
  };
}
