import React from 'react'
import { getAllPostIds, getPostData } from '../lib/posts'
import DateView from '../components/post/DateView'
import styled from 'styled-components'
import 'highlight.js/styles/atom-one-dark.css'
import Comments from '../components/post/Comments'
import Layout from '../components/common/Layout'
import { DefaultTheme } from '../theme/Theme'
import Chips from '../components/post/Chips'
import { Post as PostType } from '../lib/types'
import { SiteMeta } from '../site.config'
import MyHelmet from '../components/common/MyHelmet'

const Title = styled.h1`
  font-size: 2.4rem;
  font-family: nanumSquare;
  line-height: 50px;
  margin: 0px;
  word-break: break-all;
  color: ${(props: DefaultTheme) => props.theme.app.title};
`
const Toc = styled.div`
  .toc {
    background: rgb(206 230 255 / 80%);
    border-radius: 5px;
    padding: 5px 20px;
    margin-bottom: 20px;
    word-break: break-all;
    h3 {
      color: #0b206f;
      border-bottom: 1px solid;
    }
    ul {
      margin-top: 0px;
      padding-left: 20px;

      li {
        color: black;
        list-style-type: decimal;

        a {
          color: black;
        }
      }
    }
  }
`
const Content = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  line-height: 2.2;
  font-size: 1.1rem;
  word-break: break-all;
  a {
    text-decoration: none;
    color: #3535f7;
    font-weight: bold;
  }
  h1 {
    border-bottom: 3px solid #949494;
    border-left: 10px solid #dcdcdc;
    padding-bottom: 10px;
    padding-top: 10px;
    padding-left: 10px;
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
    line-height: 25px;
    font-size: 1rem;
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

  table {
    box-shadow: 0px 0px 5px 0px;
    &,
    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
    }
    th {
      background-color: #9292ff;
      color: white;
    }
  }
`

type PostProps = {
  post: PostType
}
const Post = ({ post }: PostProps) => {
  const { clientID, clientSecret, repo, owner, admin } = SiteMeta.gitalk
  const { title, date, content, tags, category, image, toc } = post

  return (
    <>
      <Layout>
        <MyHelmet title={title} content={content.substr(0, 50)} image={image} />
        <Title>{title}</Title>
        <DateView date={date} />
        <hr />
        <Chips category={category} tags={tags} />
        <Toc dangerouslySetInnerHTML={{ __html: toc!! }} />
        <Content dangerouslySetInnerHTML={{ __html: content }} />
        <Comments
          clientID={clientID}
          clientSecret={clientSecret}
          repo={repo}
          owner={owner}
          admin={admin}
        />
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
