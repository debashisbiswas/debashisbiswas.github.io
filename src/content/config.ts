import { z, defineCollection } from "astro:content"

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
})

const streams = defineCollection({
  type: "content",
  schema: z.object({ date: z.date() }),
})

export const collections = {
  blog,
  streams,
}
