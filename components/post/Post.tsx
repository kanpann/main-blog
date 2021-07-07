import React from 'react'
import Link from 'next/link'
import { Typography, withTheme, CardMedia } from '@material-ui/core'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import DateView from './DateView'

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
  &:hover {
    opacity: 0.6;
    transition: opacity 0.5s ease-in;
  }
`
const Meta = styled.div`
  padding: 10px 0px;
  .category {
    font-weight: bold;
    color: ${(props: DefaultTheme) => props.theme.app.title};
  }
`
const Frame = styled.div`
  word-break: break-all;
  &:hover {
    .myTitle {
      color: #a3bcff;
    }
    img {
      opacity: 0.6;
      transition: opacity 0.3s ease-in;
    }
    .defaultImg {
      opacity: 0.6;
      transition: opacity 0.3s ease-in;
    }
  }
`

const MyTitle = styled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  fontSize: '3.5vh',
  fontFamily: 'nanumSquare',
  cursor: 'pointer',
}))
const Content = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
`

type PostProps = {
  id: string
  title: string
  category: string
  date: string
  image: string
  excerpt: string
}
export const Post = ({ id, title, date, image, excerpt, category }: PostProps) => {
  return (
    <Frame>
      {image && (
        <Link href={id}>
          <a>
            <CardMedia
              component="img"
              alt="Contemplative Reptile"
              height="200"
              image={image}
              style={{ backgroundColor: 'white' }}
              title="Contemplative Reptile"
            />
          </a>
        </Link>
      )}
      {!image && (
        <Link href={id}>
          <a>
            <NoImage className="defaultImg">
              <div>No Image</div>
            </NoImage>
          </a>
        </Link>
      )}
      <Meta>
        <span className="category">
          <Link href={`/categories/${category}`}>{category}</Link>
        </span>{' '}
        <DateView date={date} />
      </Meta>
      <Link href={id}>
        <a>
          <MyTitle className="myTitle" gutterBottom variant="h4">
            {title}
          </MyTitle>
        </a>
      </Link>
      <Content>{excerpt}</Content>
    </Frame>
  )
}
