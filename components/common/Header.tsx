import React from 'react'
import { Helmet } from 'react-helmet'
import ScrollProgressBar from './ScrollProgressBar'
import { SiteMeta } from '../../site.config'

const Header = () => {
  const { title, descript, info } = SiteMeta
  return (
    <>
      <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.png" />
      <Helmet
        meta={[
          { name: 'description', content: descript },
          { property: 'og:title', content: title },
          { property: 'og:description', content: descript },
          { property: 'og:image', content: info.image },
          { property: 'og:type', content: 'website' },
          { name: 'twitter:card', content: 'summary' },
          { name: 'twitter:creator', content: info.author },
          { name: 'twitter:title', content: title },
          { name: 'twitter:description', content: descript },
        ]}
      >
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      <ScrollProgressBar />
    </>
  )
}
export default Header
