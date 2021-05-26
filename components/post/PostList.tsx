import React from 'react'
import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core'
import { Post as PostType } from '../../lib/types'
import { Post } from './Post'

const useStyles = makeStyles(() =>
  createStyles({
    link: {
      padding: '10px',
    },
  }),
)

type PostListProps = {
  posts: PostType[]
}
const PostList = ({ posts }: PostListProps) => {
  const classes = useStyles()
  return (
    <Grid container item direction="row" justify="center" alignItems="flex-start">
      {posts.map(({ id, date, title, image, excerpt, tags, category }) => (
        <Grid xs={12} md={6} item key={id} className={classes.link}>
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
      ))}
    </Grid>
  )
}

export default PostList
