import fs from 'fs'
import { SiteMeta } from '../../site.config'

const url: string = SiteMeta.url

const generateRssChannel = () =>
  `
User-agent: *
Allow: /
Host: ${url}
Sitemap: ${url}/sitemap.xml
Rss: ${url}/rss.xml
`

const generateRobots = (): void => {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  const robots: string = generateRssChannel()
  fs.writeFileSync('public/robots.txt', robots)
}
export default generateRobots
