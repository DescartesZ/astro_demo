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
 * 为博客文章生成基于标题的数字ID
 * 替换原有的文件名ID，使URL更加美观
 *
 * @param post - 博客文章集合项
 * @returns 返回包含新ID的文章对象
 */
export function generatePostId(
  post: CollectionEntry<"blogs">,
): CollectionEntry<"blogs"> {
  // 增加blog标识，防止与其他集合冲突
  const titleBasedId = createSlugFromTitle("Blog" + post.data.title);
  return {
    ...post,
    id: titleBasedId.toString(),
  };
}

/**
 * 获取所有博客文章并生成基于标题的数字ID
 *
 * @returns 返回包含数字ID的博客文章数组
 */
export async function getCollectionWithNumericIds(): Promise<
  CollectionEntry<"blogs">[]
> {
  const posts = await getCollection("blogs");
  return posts.map(generatePostId);
}
