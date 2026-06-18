import { type CollectionEntry, getCollection } from "astro:content";

/**
 * 字符串转Ascci码值对应十六进制字符
 * @param {Object} content
 * @param {Object} bit
 */
export function strToHex(content: string): number {
  try {
    let result = 0;
    for (let i = 0; i < content.length; i++) {
      // 使用 charCodeAt 获取字符的 Unicode 码点，这能正确处理中文字符
      const charCode = content.charCodeAt(i);
      // 使用更稳定的哈希算法，防止溢出
      result = (result << 5) - result + charCode;
      // 将结果转换为32位无符号整数
      result = result & 0xffffffff;
    }

    // 确保返回正数
    return result >>> 0; // 无符号右移，确保为正数
  } catch (error) {
    console.log("报错Error:", error);
    return 0;
  }
}

export function createSlugFromTitle(title: string): string {
  let slug = title
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  return strToHex(slug);
}

/**
 * 从中文标题中提取英文关键词，生成语义化 slug
 * 例如: "【Vue3】Vue3使用Axios请求二次封装" → "vue3-axios"
 * 例如: "【Android】Android权限清单" → "android"
 * 如果无法提取足够的关键词，则回退到哈希值
 *
 * @param title - 文章标题
 * @param fallbackSuffix - 当提取的关键词不足时使用的备选后缀（如文件名）
 * @returns 语义化 slug 字符串
 */
export function generateSemanticSlug(
  title: string,
  fallbackSuffix?: string,
): string {
  // 1. 提取所有连续的拉丁字母和数字（忽略大小写差异后去重）
  const latinMatches = title.match(/[a-zA-Z0-9]+/g) || [];
  const uniqueWords = [
    ...new Set(latinMatches.map((w) => w.toLowerCase())),
  ];

  // 2. 过滤掉过短或无意义的词（如单个数字）
  const meaningfulWords = uniqueWords.filter((w) => w.length >= 2 || /^[a-zA-Z]/.test(w));

  let slug = meaningfulWords.join("-");

  // 3. 如果标题中提取的词不足，尝试从文件名/备选后缀中提取
  if (slug.length < 3 && fallbackSuffix) {
    const fallbackMatches = fallbackSuffix.match(/[a-zA-Z0-9]+/g) || [];
    const fallbackWords = [
      ...new Set(fallbackMatches.map((w) => w.toLowerCase())),
    ].filter((w) => w.length >= 2);
    slug = fallbackWords.join("-");
  }

  // 4. 最后回退到哈希值
  if (slug.length < 2) {
    slug = "post-" + createSlugFromTitle(title);
  }

  // 5. 清理：去除首尾连字符，限制长度
  slug = slug.replace(/^-+|-+$/g, "").replace(/-+/g, "-");
  if (slug.length > 80) {
    slug = slug.substring(0, 80).replace(/-+$/g, "");
  }

  return slug;
}

export function getAllTags(posts: CollectionEntry<"blogs">[]) {
  const tags: string[] = [
    ...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean)),
  ];

  return tags
    .map((tag) => {
      return {
        name: tag,
        id: createSlugFromTitle(tag),
      };
    })
    .filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
    });
}

export const withBase = (path: string) => path;
/**
 * 根据标签ID获取匹配的文章列表
 *
 * @param posts - 文章集合数组，包含博客文章的数据
 * @param tagId - 要筛选的标签ID，用于匹配文章中的标签
 * @returns 返回包含指定标签的所有文章数组
 */
export function getPostsByTag(
  posts: CollectionEntry<"blogs">[],
  tagId: string,
) {
  // 过滤出包含指定标签ID的文章
  const filteredPosts: CollectionEntry<"blogs">[] = posts.filter((post) =>
    (post.data.tags || [])
      .map((tag) => createSlugFromTitle(tag))
      .includes(tagId),
  );
  return filteredPosts;
}

/**
 * 按照发布日期降序排列博客文章
 *
 * @param itemA - 第一个要比较的博客文章项
 * @param itemB - 第二个要比较的博客文章项
 * @returns 返回一个数字，用于数组排序：正数表示itemB在前，负数表示itemA在前，0表示相等
 */
export function sortItemsByDateDesc(
  itemA: CollectionEntry<"blogs">,
  itemB: CollectionEntry<"blogs">,
) {
  // 计算两个项目发布日期的时间戳差值，实现降序排列
  return (
    new Date(itemB.data.pubDate).getTime() -
    new Date(itemA.data.pubDate).getTime()
  );
}

/**
 * 为博客文章生成语义化 slug ID
 * 从中文标题中提取英文关键词，生成可读的 URL slug
 *
 * @param post - 博客文章集合项
 * @returns 返回包含语义化 slug ID 的文章对象
 */
export function generatePostId(
  post: CollectionEntry<"blogs">,
): CollectionEntry<"blogs"> {
  // 提取文件名 stem 作为备选关键词来源
  const fileStem = post.id.replace(/\.[^.]+$/, "");
  const slug = generateSemanticSlug(post.data.title, fileStem);
  return {
    ...post,
    id: slug,
  };
}

/**
 * 获取所有博客文章并生成语义化 slug ID
 * 自动处理重复 slug：如果两篇文章生成相同 slug，后续文章会添加数字后缀
 *
 * @returns 返回包含语义化 slug ID 的博客文章数组
 */
export async function getCollectionWithNumericIds(): Promise<
  CollectionEntry<"blogs">[]
> {
  const posts = await getCollection("blogs");
  const slugCount = new Map<string, number>();
  const result: CollectionEntry<"blogs">[] = [];

  for (const post of posts) {
    const fileStem = post.id.replace(/\.[^.]+$/, "");
    let slug = generateSemanticSlug(post.data.title, fileStem);

    // 处理重复 slug：如果已存在相同 slug，添加数字后缀
    const count = slugCount.get(slug) || 0;
    if (count > 0) {
      slug = `${slug}-${count + 1}`;
    }
    slugCount.set(slug, count + 1);

    result.push({ ...post, id: slug });
  }

  return result;
}
