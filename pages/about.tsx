import React from 'react'
import Layout from '../components/common/Layout'
import { getAbout } from '../lib/posts'
import styled, { DefaultTheme } from 'styled-components'

const Content = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  .info {
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
  h1,
  h2 {
    color: ${(props: DefaultTheme) => props.theme.app.title};
  }
  table {
    width: 100%;
    word-break: keep-all;
    td {
      padding: 7px;
    }
  }
`

type AboutProps = {
  content: string
}
const About = ({ content }: AboutProps) => {
  return (
    <Layout>
      <Content dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  )
}
export const getStaticProps = async () => {
  const content = await getAbout()

  return {
    props: {
      content,
    },
  }
}

export default About
