import { getSortedPostsData } from '../lib/posts'
import { Category, CategoryInfo } from '../site.config'
import styled, { PostHeaderTheme } from 'styled-components'
import React, { memo } from 'react'
import PostList from '../components/post/PostList'
import Layout from '../components/common/Layout'
import { useRouter } from 'next/dist/client/router'
import { Post } from '../lib/types'
import MyHelmet from '../components/common/MyHelmet'
import Link from 'next/link'
import paging from '../lib/paging-util'
import PagingUtil from '../lib/paging-util'

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
const Pagination = styled.div`
  .left {
    float: left;
    border-bottom: 3px solid black;
    border-left: 4px solid #cecece;
    border-radius: 5px;
    padding: 5px;
  }
  .right {
    float: right;
    border-bottom: 3px solid black;
    border-right: 4px solid #cecece;
    border-radius: 3px;
    padding: 5px;
  }
  a {
    color: black;
  }
  font-size: 2rem;
  margin: 20px 0px;
`

type MenuProps = {
  posts: Post[]
}
const Menu = ({ posts }: MenuProps) => {
  const router = useRouter()
  const menu = router.query.menu as string
  const topMenu = router.query.topMenu as string

  const page = Number(router.query.page as string) || 1

  if (!menu) {
    return <></>
  }
  const categoryInfo = CategoryInfo[menu]
  let subCategorys = topMenu ? [] : Category[menu].sub

  const util = new PagingUtil(
    page,
    posts.filter((post) => subCategorys.indexOf(post.category) != -1 || post.category == menu),
  )
  posts = util.result
  let nowUrl = `${window.location.pathname}${window.location.search}`
  nowUrl = nowUrl.substr(0, nowUrl.lastIndexOf('&') != -1 ? nowUrl.lastIndexOf('&') : nowUrl.length)

  return (
    <Layout>
      <MyHelmet title={`'${menu}' 메뉴`} content={`${menu} 메뉴에 대한 글들입니다.`} />
      <PostHeader image={categoryInfo && categoryInfo.image}>
        <PostHeaderFrame>
          <PostTitle>{menu}</PostTitle>
          <DateFrame>{categoryInfo && categoryInfo.descript}</DateFrame>
        </PostHeaderFrame>
      </PostHeader>
      <PostList posts={posts} />
      <Pagination>
        <Link href={`${nowUrl}&page=${page - 1}`}>
          <a className="left">Previous</a>
        </Link>
        <Link href={`${nowUrl}&page=${page + 1}`}>
          <a className="right">Next</a>
        </Link>
      </Pagination>
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
