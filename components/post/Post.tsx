import React from 'react'
import Link from 'next/link'
import { Typography, CardContent, Card, withTheme, CardMedia } from '@material-ui/core'
import styled from 'styled-components'
import { styled as muiStyled } from '@material-ui/core/styles'
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
const Caption = styled.div`
  width: 100%;
  height: 100%;
  position: absolute; /*내부 요소의 고정 위치 설정(2)*/
  top: 0;
  left: 0;
  color: #fff;
  padding: 20px;
  box-sizing: border-box; /* 300x300 안에 padding이 적용되도록 함 */
  opacity: 0;
  transition: 0.7s; /*caption에 이벤트가 발생하여 0.5초 딜레이 후 발생시킴*/
  background: rgb(0 0 0 / 80%);

  p {
    color: #c7c7c7;
    font-size: 1.8vh;
  }
  a {
    color: #fff;
    background-color: teal;
    padding: 7px;
    border-radius: 3px;
    &:hover {
      background-color: #fff;
      color: #000;
    }
  }
`
const MyCard = muiStyled(withTheme(Card))((props: DefaultTheme) => ({
  backgroundColor: props.theme.app.card,
  display: 'inline-block',
  width: '100%',
  position: 'relative',
  '&:hover': {
    boxShadow: '1px 1px 5px 1px',
  },
  '& div:hover': {
    opacity: 1,
  },
}))
const MyTitle = styled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  fontSize: '3.5vh',
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
        <Link href={id}>
          <a>
            <Caption>
              <Chips category={category} tags={tags} />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{ height: '100%' }}
              >
                {excerpt}
              </Typography>
            </Caption>
          </a>
        </Link>
      </CardContent>
    </MyCard>
  )
}
