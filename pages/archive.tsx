import React, { memo } from 'react'
import { getSortedPostsData } from '../lib/posts'
import { Post } from '../types/post'
import { Layout } from '../components/common'
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@material-ui/lab'
import { Typography } from '@material-ui/core'
import Link from 'next/link'

const parsingDateAndPosts = (posts: Post[]) => {
  const obj = {}
  posts.forEach((post: Post) => {
    const yyyyMm = post.date.substr(0, 7)
    if (obj[yyyyMm] == undefined) {
      obj[yyyyMm] = [post]
    } else {
      obj[yyyyMm] = [...obj[yyyyMm], post]
    }
  })
  return obj
}

type ArchiveProps = {
  posts: Post[]
}
const Archive = ({ posts }: ArchiveProps) => {
  const parsingData: Object = parsingDateAndPosts(posts)
  return (
    <Layout>
      <Timeline>
        {Object.keys(parsingData).map((key) => {
          const target = parsingData[key]
          return (
            <TimelineItem>
              <TimelineOppositeContent style={{ flex: 0, paddingTop: '0px' }}>
                <Typography variant="h5" color="textPrimary">
                  {key}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {target.map((element) => {
                  return (
                    <Typography color="textSecondary" variant="subtitle1" paragraph={true}>
                      -{' '}
                      <Link href={element.id}>
                        <a>{element.title}</a>
                      </Link>
                    </Typography>
                  )
                })}
              </TimelineContent>
            </TimelineItem>
          )
        })}
      </Timeline>
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
export default memo(Archive)
