import React from 'react'
import { findPostDataByTag, getAllTags } from '../../lib/posts'
import { Post } from '../../types/post'
import { useRouter } from 'next/dist/client/router'
import { styled as muiStyled, Typography, withTheme } from '@material-ui/core'
import { DefaultTheme } from '../../theme/Theme'
import { PostList } from '../../components/post'
import { MyPagination, MyHelmet, Layout } from '../../components/common'
import PagingUtil from '../../lib/paging-util'
import { TagPath } from '../../types/path'

const Title = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  marginBottom: '50px',
  fontFamily: 'sunspots',
}))
type TagProps = {
  posts: Post[]
  tag: string
}
const Tag = ({ posts, tag }: TagProps) => {
  const { query } = useRouter()
  const page: number = Number(query.page as string) || 1

  const util = new PagingUtil(page, posts)
  const { result, totalPage } = util.getObj()
  return (
    <Layout>
      <MyHelmet title={`'${tag}'태그의 글 목록`} content={`'${tag}'태그의 글 목록입니다.`} />
      <Title variant="h2" align="center">
        #{tag}
      </Title>
      <PostList posts={result} />
      <hr />
      <MyPagination target={`/tags/${tag}`} page={page} totalPage={totalPage} />
    </Layout>
  )
}
export const getStaticPaths = async () => {
  const paths: TagPath[] = await getAllTags()
  return {
    paths,
    fallback: false,
  }
}
export const getStaticProps = async ({ params }) => {
  const tag: string = params.tag
  const posts: Post[] = await findPostDataByTag(tag)

  return {
    props: {
      posts,
      tag,
    },
  }
}
export default Tag
