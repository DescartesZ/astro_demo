import { type CollectionEntry } from "astro:content";

export function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
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

export const withBase = (path: string) => `${import.meta.env.BASE_URL}${path}`;
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
