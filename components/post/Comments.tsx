import React from 'react'
import 'gitalk/dist/gitalk.css'
import loadable from '@loadable/component'
import { createGlobalStyle } from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
const GitalkComponent = loadable(() => import('gitalk/dist/gitalk-component'))

const Style = createGlobalStyle`
  .gt-container {
    color: ${(props: DefaultTheme) => props.theme.app.title}
  }
  svg {
    fill: ${(props: DefaultTheme) => props.theme.app.title} !important;
  }
  .gt-comment-content {
    background-color: ${(props: DefaultTheme) => props.theme.app.background} !important;
    border-radius: 10px;
  }
  .gt-comment-username {
    color: ${(props: DefaultTheme) => props.theme.app.title} !important;
  }
  .gt-comment-date {
    color: ${(props: DefaultTheme) => props.theme.app.font} !important;
  }
  .gt-comment-body {
    p {
      color: ${(props: DefaultTheme) => props.theme.app.title} !important;
      font-weight: bold;
    }
  }
`
type CommentsProps = {
  clientID: string
  clientSecret: string
  repo: string
  owner: string
  admin: string[]
}
const Comments = ({ clientID, clientSecret, repo, owner, admin }: CommentsProps) => {
  return (
    <>
      <Style />
      <GitalkComponent
        options={{
          clientID: clientID,
          clientSecret: clientSecret,
          repo: repo,
          owner: owner,
          admin: admin,
        }}
      />
    </>
  )
}
export default Comments
