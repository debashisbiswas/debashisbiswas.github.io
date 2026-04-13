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

export const collections = { blog }
