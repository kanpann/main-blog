import React, { memo } from 'react'
import PostList from '../components/post/PostList'
import { getSortedPostsData, Post } from '../lib/posts'
import Layout from '../components/common/Layout'
import generateRss from '../lib/feed'
import generateSitemap from '../lib/sitemap'
import generateRobots from '../lib/robots'

type HomeProps = {
  posts: Post[]
}
const Home = ({ posts }: HomeProps) => {
  return (
    <Layout>
      <PostList posts={posts} />
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
