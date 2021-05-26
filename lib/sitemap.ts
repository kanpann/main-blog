import { Post } from './types'
import fs from 'fs'
import { SiteMeta } from '../site.config'

const generateSitemapItem = (post: Post): string => `
  <url>
    <loc>${SiteMeta.url}${post.id}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
`

const generateSitemapChannel = (posts: Post[]): string => `
  <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  >
    ${posts.map(generateSitemapItem).join('')}
  </urlset>
`

const generateSitemap = (allPostsData: Post[]): void => {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const sitemap = generateSitemapChannel(allPostsData)
  fs.writeFileSync('public/sitemap.xml', sitemap)
}

export default generateSitemap
