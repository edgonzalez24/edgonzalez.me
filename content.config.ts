import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection(
      asSitemapCollection ({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string().min(3),
        description: z.string().min(10),
        date: z.date(),
        tags: z.array(z.string()).optional(),
        author: z.string().optional(),
        thumbnail: z.string(),
      })
    })
    )
  }
})
