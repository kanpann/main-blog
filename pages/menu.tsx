import { getSortedPostsData } from '../lib/posts'
import { Category, CategoryInfo } from '../site.config'
import styled, { PostHeaderTheme } from 'styled-components'
import React, { memo } from 'react'
import PostList from '../components/post/PostList'
import Layout from '../components/common/Layout'
import { useRouter } from 'next/dist/client/router'
import { Post } from '../lib/types'
import MyHelmet from '../components/common/MyHelmet'

const PostHeader = styled.div`
  background-size: cover;
  background-position: center;
  height: 20rem;
  margin-bottom: 2rem;
  background-image: ${(props: PostHeaderTheme) => `url(${props.image})`};
  background-color: white;
`
const PostHeaderFrame = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
const PostTitle = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 3.2rem;
  word-break: break-word;
  color: #fff;
  font-family: 'sunspots';
`
const DateFrame = styled.div`
  font-size: 1.125em;
  color: #ffffffc2;
  padding: 0px 30px;
`

type MenuProps = {
  posts: Post[]
}
const Menu = ({ posts }: MenuProps) => {
  const router = useRouter()
  const menu = router.query.menu as string
  const topMenu = router.query.topMenu as string

  if (!menu) {
    return <></>
  }

  const categoryInfo = CategoryInfo[menu]

  let subCategorys = topMenu ? [] : Category[menu].sub

  console.log(categoryInfo)
  return (
    <Layout>
      <MyHelmet title={`'${menu}' 메뉴`} content={`${menu} 메뉴에 대한 글들입니다.`} />
      <PostHeader image={categoryInfo && categoryInfo.image}>
        <PostHeaderFrame>
          <PostTitle>{menu}</PostTitle>
          <DateFrame>{categoryInfo && categoryInfo.descript}</DateFrame>
        </PostHeaderFrame>
      </PostHeader>
      <PostList
        posts={posts.filter(
          (post) => subCategorys.indexOf(post.category) != -1 || post.category == menu,
        )}
      />
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
export default memo(Menu)
