import React from 'react'
import { Grid } from '@material-ui/core'
import { Post } from './Post'
import { Post as PostType } from '../../lib/types'

type PostListProps = {
  posts: PostType[]
}
const PostList = ({ posts }: PostListProps) => {
  const postsCnt = posts.length
  return (
    <Grid container item direction="row" justify="center" alignItems="flex-start">
      {posts.map(({ id, date, title, image, excerpt, tags, category }, index) => {
        const gridNum = postsCnt % 2 == 1 && 0 == index ? 12 : 6
        return (
          <Grid xs={12} sm={12} md={gridNum} item key={id} style={{ padding: '10px' }}>
            <Post
              id={id}
              title={title}
              date={date}
              image={image}
              excerpt={excerpt!!}
              tags={tags}
              category={category}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PostList
