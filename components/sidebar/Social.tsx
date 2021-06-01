import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import GitHubIcon from '@material-ui/icons/GitHub'
import EmailIcon from '@material-ui/icons/Email'
import RssFeedIcon from '@material-ui/icons/RssFeed'

const Frame = styled.div`
  cursor: pointer;
  margin-top: 20px;
  color: ${(props: DefaultTheme) => props.theme.app.title};
  span {
    margin: 10px;
  }
`
type SocialProps = {
  github: string
  email: string
}
const Social = ({ github, email }: SocialProps) => {
  return (
    <Frame>
      {github && (
        <Link href={github}>
          <GitHubIcon style={{ marginRight: '20px' }} />
        </Link>
      )}
      {email && (
        <Link href={`mailto:${email}`}>
          <EmailIcon style={{ marginRight: '20px' }} />
        </Link>
      )}
      <Link href="/rss.xml">
        <RssFeedIcon style={{ marginRight: '20px' }} />
      </Link>
    </Frame>
  )
}
export default Social
