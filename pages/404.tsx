import Layout from '../components/common/Layout'
import { styled as muiStyled } from '@material-ui/core/styles'
import { Button, Typography, withTheme } from '@material-ui/core'
import { DefaultTheme } from 'styled-components'
import React from 'react'
import Link from 'next/link'

const NotFoundMsg = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  fontFamily: 'sunspots',
}))
const ContentsMsg = muiStyled(withTheme(Typography))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  fontFamily: 'sunspots',
  margin: '25px 0px',
}))
const NotFound = () => {
  return (
    <Layout
      helmetInfo={{
        title: `404 - Page Not Found`,
        content: `페이지를 찾을 수 없어요.`,
      }}
    >
      <NotFoundMsg variant="h1" align="center">
        404
      </NotFoundMsg>
      <NotFoundMsg variant="h3" align="center">
        Page Not Found
      </NotFoundMsg>
      <ContentsMsg align="center">
        찾을 수 없는 페이지입니다. 요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요.
      </ContentsMsg>
      <ContentsMsg style={{ textAlign: 'center' }}>
        <Link href="/">
          <Button variant="outlined" color="primary">
            홈으로
          </Button>
        </Link>
      </ContentsMsg>
    </Layout>
  )
}
export default NotFound
