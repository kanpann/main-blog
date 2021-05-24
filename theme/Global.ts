import { createGlobalStyle } from 'styled-components'
import { DefaultTheme } from './Theme'

const lightTheme = createGlobalStyle`
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
  }
  a:visited {
    text-decoration: none;
  }
  a:hover {
    text-decoration: none;
  }
`
export default lightTheme
