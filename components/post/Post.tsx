import React from 'react'
import Link from 'next/link'
import { Typography, CardContent, Card, withTheme, CardMedia } from '@material-ui/core'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import DateView from './DateView'
import Chips from './Chips'

const NoImage = styled.div`
  height: 200px;
  width: 100%;
  background-color: #e2e2e2;
  color: black;
  font-size: 3rem;
  text-align: center;
  justify-content: center;
  font-family: 'sunspots';

  div {
    position: relative;
    top: 80px;
  }
`
const MyCard = styled(withTheme(Card))((props: DefaultTheme) => ({
  backgroundColor: props.theme.app.card,
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '1px 1px 5px 1px',
  },
}))
const MyTitle = styled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  fontFamily: 'nanumSquare',
}))

type PostProps = {
  id: string
  title: string
  category: string
  date: string
  image: string
  tags: string[]
  excerpt: string
}
export const Post = ({ id, title, date, image, excerpt, tags, category }: PostProps) => {
  return (
    <Link href={id}>
      <MyCard>
        {image && (
          <CardMedia
            component="img"
            alt="Contemplative Reptile"
            height="200"
            image={image}
            style={{ backgroundColor: 'white' }}
            title="Contemplative Reptile"
          />
        )}
        {!image && (
          <NoImage>
            <div>No Image</div>
          </NoImage>
        )}
        <CardContent>
          <MyTitle gutterBottom variant="h4">
            {title}
          </MyTitle>
          <DateView date={date} />
          <Chips category={category} tags={tags} />
          <Typography variant="body2" color="textSecondary" component="p">
            {excerpt}
          </Typography>
        </CardContent>
      </MyCard>
    </Link>
  )
}
