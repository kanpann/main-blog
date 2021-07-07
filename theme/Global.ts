import { createGlobalStyle } from 'styled-components'
import { DefaultTheme } from './Theme'

const lightTheme = createGlobalStyle`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  body {
    margin: 0px;
    font-family: 'nanumBarunGothic';
    background-color: ${(props: DefaultTheme) => props.theme.app.background};
    line-height: 30px;
  }
  img {
    max-width: 100%;
    display: block;
  }
  a:link {
    text-decoration: none;
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
  a:visited {
    text-decoration: none;
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
  a:hover {
    text-decoration: none;
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
`
export default lightTheme
