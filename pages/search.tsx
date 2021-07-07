import React from 'react'
import { getSortedPostsData } from '../lib/posts'
import { styled as muiStyled, Typography, withTheme } from '@material-ui/core'
import { DefaultTheme } from '../theme/Theme'
import { useRouter } from 'next/dist/client/router'
import { Post } from '../types/post'
import PagingUtil from '../lib/paging-util'
import { MyPagination, MyHelmet, Layout } from '../components/common'
import { PostList } from '../components/post'

const NotFoundMsg = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
}))

type SearchProps = {
  posts: Post[]
}
const Search = ({ posts }: SearchProps) => {
  const { query } = useRouter()
  const keyword: string = query.keyword as string
  const page: number = Number(query.page as string) || 1

  if (!keyword) {
    return <></>
  }

  const searchResult = posts.filter(
    (post: Post) =>
      post.title.toLowerCase().indexOf(keyword.toLowerCase()) > 0 ||
      post.content.toLowerCase().indexOf(keyword.toLowerCase()) > 0,
  )

  const util = new PagingUtil(page, searchResult)
  const { result: pagingResult, totalPage } = util.getObj()

  return (
    <Layout>
      <MyHelmet title={`'${keyword}'의 검색결과`} content={`'${keyword}'의 검색결과입니다.`} />
      {pagingResult.length > 0 ? (
        pagingResult && <PostList posts={pagingResult} />
      ) : (
        <NotFoundMsg variant="h5" align="center">
          검색 결과가 없습니다.
          <br /> 검색 알고리즘이 그리 좋지 않으니 키워드 위주로 검색해주세요!
        </NotFoundMsg>
      )}
      <hr />
      <MyPagination queryStr={`keyword=${keyword}`} page={page} totalPage={totalPage} />
    </Layout>
  )
}
export const getStaticProps = async () => {
  const posts: Post[] = await getSortedPostsData()
  return {
    props: {
      posts,
    },
  }
}

export default Search
