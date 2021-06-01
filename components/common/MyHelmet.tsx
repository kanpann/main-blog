import React from 'react'
import { Helmet } from 'react-helmet'
import { SiteMeta } from '../../site.config'

type MyHelmetProps = {
  title: string
  content: string
  image?: string
}
const MyHelmet = ({ title, content, image }: MyHelmetProps) => {
  const { author } = SiteMeta.info
  return (
    <Helmet
      meta={[
        { name: 'description', content: content },
        { property: 'og:title', content: title },
        { property: 'og:description', content: content },
        { property: 'og:image', content: image },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:creator', content: author },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: content },
      ]}
    >
      <meta charSet="utf-8" />
      <title>{title}</title>
    </Helmet>
  )
}
export default MyHelmet
