import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

const articleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.date(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  thumbnail: z.string(),
})

export default defineContentConfig({
  collections: {
    en_articles: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'articles/en/**/*.md',
        schema: articleSchema,
      })
    ),
    es_articles: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: 'articles/es/**/*.md',
        schema: articleSchema,
      })
    ),
  }
})
