import React from 'react'
import { Container, Grid, Hidden } from '@material-ui/core'
import Logo from './Logo'
import Head from './Head'
import SideMenuBar from './SideMenuBar'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import { Helmet } from 'react-helmet'
import { SiteMeta } from '../../site.config'

const Frame = styled.div`
  background-color: ${(props: DefaultTheme) => props.theme.app.box};
  padding: 10px 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
`
type HelmetInfoType = {
  title: string
  content?: string
  image?: string
}
type LayoutProps = {
  children: JSX.Element[] | JSX.Element
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined
  helmetInfo?: HelmetInfoType
}
const Layout = ({ children, maxWidth = 'lg', helmetInfo }: LayoutProps) => {
  return (
    <Container fixed disableGutters={true} maxWidth={maxWidth}>
      {helmetInfo && (
        <Helmet
          meta={[
            { name: 'description', content: helmetInfo.content },
            { property: 'og:title', content: helmetInfo.title },
            { property: 'og:description', content: helmetInfo.content },
            { property: 'og:image', content: helmetInfo.image },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: SiteMeta.info.author },
            { name: 'twitter:title', content: helmetInfo.title },
            { name: 'twitter:description', content: helmetInfo.content },
          ]}
        >
          <meta charSet="utf-8" />
          <title>{helmetInfo.title}</title>
        </Helmet>
      )}
      <Logo />
      <Frame>
        <Head />
        <Grid container direction="row" justify="center" alignItems="flex-start">
          <Hidden smDown>
            <Grid item md={3}>
              <SideMenuBar />
            </Grid>
          </Hidden>
          <Grid item xs={12} md={9}>
            {children}
          </Grid>
        </Grid>
      </Frame>
    </Container>
  )
}
export default Layout
