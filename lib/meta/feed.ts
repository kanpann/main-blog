import fs from 'fs'
import { Post } from '../types'
import { SiteMeta } from '../../site.config'

const { title, url, info } = SiteMeta

const generateRssItem = (post: Post): string => `
  <item>
    <guid><![CDATA[${url}${post.id}]]></guid>
    <title><![CDATA[${post.title}]]></title>
    <link><![CDATA[${url}${post.id}]]></link>
    <description><![CDATA[${post.excerpt}]]></description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  </item>
`

const generateRssChannel = (posts: Post[]): string => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${title}</title>
      <link>${url}</link>
      <description>${info.descript}</description>
      <language>ko</language>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="https://gunlog.dev/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`

const generateRss = (allPostsData: Post[]): void => {
  if (process.env.NODE_ENV === 'development') {
    return
  }

  const rss = generateRssChannel(allPostsData)
  fs.writeFileSync('public/rss.xml', rss)
}

export default generateRss
