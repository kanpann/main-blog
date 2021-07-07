import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'

const CustomLogo = styled.div`
  margin: 15px 0px;
  font-family: 'sunspots';
  font-size: 6rem;
  text-align: center;
  padding: 50px 10px;
  user-select: none;
  a {
    color: ${(props: DefaultTheme) => props.theme.app.box} !important;
    text-shadow: ${(props: DefaultTheme) => '2px 2px 10px ' + props.theme.app.title};
    &:hover {
      text-shadow: ${(props: DefaultTheme) => '2px 2px 12px ' + props.theme.app.title};
    }
  }
`

const Logo = () => {
  return (
    <CustomLogo>
      <Link href="/">Gunlog</Link>
    </CustomLogo>
  )
}
export default Logo
