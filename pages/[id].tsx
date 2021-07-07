import React from 'react'
import { getAllPostIds, findPostDataById } from '../lib/posts'
import { DateView, Comments } from '../components/post'
import 'highlight.js/styles/atom-one-dark.css'
import { Layout, MyHelmet } from '../components/common'
import { Post as PostType } from '../types/post'
import { SiteMeta } from '../site.config'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import Link from 'next/link'
import { Category, Title, Tags, Toc, Content } from '../styles/PostStyle'
import { CommentType } from '../types/config'
import { IdPath } from '../types/path'

type PostProps = {
  post: PostType
}
const Post = ({ post }: PostProps) => {
  const { clientID, clientSecret, repo, owner, admin }: CommentType = SiteMeta.gitalk
  const { title, date, content, tags, category, image, toc }: PostType = post

  return (
    <Layout>
      <MyHelmet title={title} content={content.substr(0, 50)} image={image} />
      <Category>
        <Link href={`/categories/${category}`}>{category}</Link>
      </Category>
      <hr />
      <Title>{title}</Title>
      <DateView date={date} />
      <Tags>
        <LocalOfferIcon fontSize="inherit" titleAccess="태그" />
        {tags &&
          tags.map((tag, index) => (
            <Link key={index} href={`/tags/${tag}`}>
              <a href="3">#{tag}</a>
            </Link>
          ))}
      </Tags>
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
  )
}
export const getStaticPaths = async () => {
  const paths: IdPath[] = getAllPostIds()
  return {
    paths,
    fallback: false,
  }
}
export const getStaticProps = async ({ params }) => {
  const id = params.id
  const post: PostType = await findPostDataById(id)
  return {
    props: {
      post,
    },
  }
}
export default Post
