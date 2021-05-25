import React from 'react'
import { getAllPostIds, getPostData, Post as PostType } from '../lib/posts'
import DateView from '../components/post/DateView'
import styled from 'styled-components'
import 'highlight.js/styles/atom-one-dark.css'
import Comments from '../components/post/Comments'
import Layout from '../components/common/Layout'
import { DefaultTheme } from '../theme/Theme'
import Chips from '../components/post/Chips'

const Title = styled.h1`
  font-size: 2.4rem;
  font-family: nanumSquare;
  line-height: 50px;
  margin: 0px;
  word-break: keep-all;
  color: ${(props: DefaultTheme) => props.theme.app.title};
`
const Content = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  line-height: 2.2;
  font-size: 1.1rem;
  a {
    text-decoration: none;
    color: #3535f7;
    font-weight: bold;
  }
  h1 {
    border-bottom: 3px solid #dcdcdc;
    padding-bottom: 10px;
    padding-top: 10px;
  }
  p {
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: ${(props: DefaultTheme) => props.theme.app.title};
    line-height: 40px;
    word-break: keep-all;
  }
  p code {
    background: #dadada;
    padding: 0px 5px;
    font-weight: bold;
    color: black;
  }
  img {
    background: white;
  }
  pre {
    padding: 15px;
    border-radius: 5px;
  }
  blockquote {
    border-left: 15px solid #81dfed;
    padding: 5px 0px 5px 20px;
    background-color: #ececec;
    margin: 0px;
    font-style: oblique;
    p {
      color: #464646;
      margin: 0px;
      padding: 0px;
    }
  }
`

type PostProps = {
  post: PostType
}
const Post = ({ post }: PostProps) => {
  const { title, date, content, tags, category, image } = post
  return (
    <>
      <Layout helmetInfo={{ title: title, content: content.substr(0, 50), image: image }}>
        <Title>{title}</Title>
        <DateView date={date} />
        <hr />
        <Chips category={category} tags={tags} />
        <Content dangerouslySetInnerHTML={{ __html: content }} />
        <Comments />
      </Layout>
    </>
  )
}
export const getStaticPaths = async () => {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}
export const getStaticProps = async ({ params }) => {
  const post: PostType = await getPostData(params.id)
  return {
    props: {
      post,
    },
  }
}
export default Post
