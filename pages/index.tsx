import React, { memo } from 'react'
import PostList from '../components/post/PostList'
import { getSortedPostsData } from '../lib/posts'
import { Post } from '../lib/types'
import Layout from '../components/common/Layout'
import generateRss from '../lib/meta/feed'
import generateSitemap from '../lib/meta/sitemap'
import generateRobots from '../lib/meta/robots'
import PagingUtil from '../lib/paging-util'
import { useRouter } from 'next/dist/client/router'
import Pagination from '../components/common/Pagination'

type HomeProps = {
  posts: Post[]
}
const Home = ({ posts }: HomeProps) => {
  const router = useRouter()
  const page = Number(router.query.page as string) || 1

  const util = new PagingUtil(page, posts)
  const { isPrev, isNext, result } = util
  return (
    <Layout>
      <PostList posts={result} />
      <Pagination isPrev={isPrev} isNext={isNext} page={page} />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const posts = await getSortedPostsData()
  generateRss(posts)
  generateSitemap(posts)
  generateRobots()

  return {
    props: {
      posts,
    },
  }
}
export default memo(Home)
