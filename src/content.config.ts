import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.date(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
  // 修改为只接受字符串，不使用 image()
  image: z
    .object({
      url: z.string(), // 改为 z.string()
      alt: z.string().optional(),
    })
    .optional(),
});

const postsCollection = defineCollection({
  type: "content",
  loader: [
    glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blogs" }),
    glob({ pattern: "**/*.{md,mdx}", base: "./src/content/javaScript" }),
  ],
  schema: blogSchema,
});

export const collections = {
  posts: postsCollection,
};
