import React from 'react'
import Layout from '../components/common/Layout'
import { getSortedPostsData } from '../lib/posts'
import { styled as muiStyled } from '@material-ui/core/styles'
import { Typography, withTheme } from '@material-ui/core'
import { DefaultTheme } from '../theme/Theme'
import { useRouter } from 'next/dist/client/router'
import PostList from '../components/post/PostList'
import { Post } from '../lib/types'

const NotFoundMsg = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
}))

type SearchProps = {
  posts: Post[]
}
const Search = ({ posts }: SearchProps) => {
  const router = useRouter()
  const keyword = router.query.keyword as string

  if (!keyword) {
    return <></>
  }

  const searchResult = posts.filter(
    (post) =>
      post.title.toLowerCase().indexOf(keyword.toLowerCase()) > 0 ||
      post.content.toLowerCase().indexOf(keyword.toLowerCase()) > 0,
  )

  return (
    <Layout
      helmetInfo={{
        title: `'${keyword}'의 검색결과`,
      }}
    >
      {searchResult.length > 0 ? (
        searchResult && <PostList posts={searchResult} />
      ) : (
        <NotFoundMsg variant="h5" align="center">
          검색 결과가 없습니다.
          <br /> 검색 알고리즘이 그리 좋지 않으니 키워드 위주로 검색해주세요!
        </NotFoundMsg>
      )}
    </Layout>
  )
}
export const getStaticProps = async () => {
  const posts = await getSortedPostsData()
  return {
    props: {
      posts,
    },
  }
}

export default Search
