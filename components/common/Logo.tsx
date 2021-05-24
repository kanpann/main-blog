import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'

const CustomLogo = styled.div`
  margin: 0 auto;
  margin: 50px 0px;
  cursor: pointer;
  font-family: 'sunspots';
  font-size: 6rem;
  text-align: center;
  padding: 50px 10px;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  color: ${(props: DefaultTheme) => props.theme.app.box};
  text-shadow: ${(props: DefaultTheme) => '2px 2px 10px ' + props.theme.app.title};

  &:hover {
    text-shadow: ${(props: DefaultTheme) => '2px 2px 50px ' + props.theme.app.title};
  }
`

const Logo = () => {
  return (
    <Link href="/">
      <CustomLogo>Gunlog</CustomLogo>
    </Link>
  )
}
export default Logo
