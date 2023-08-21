import { z, defineCollection } from "astro:content"

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
})

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
}
