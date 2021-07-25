import styled from 'styled-components'
import { DefaultTheme } from '../theme/Theme'

export const Title = styled.h1`
  font-size: 2.5rem;
  line-height: 50px;
  margin: 0px;
  word-break: break-all;
  color: ${(props: DefaultTheme) => props.theme.app.title};
`
export const Category = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  font-weight: bold;
  font-size: 1.3rem;
`
export const Tags = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  a {
    margin-right: 8px;
  }
`
export const Toc = styled.div`
  .toc {
    background: ${(props: DefaultTheme) => props.theme.app.toc};
    border-radius: 5px;
    padding: 5px 20px;
    margin-top: 10px;
    margin-bottom: 20px;
    word-break: break-all;
    h3 {
      color: #0b206f;
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }
    ul {
      margin-top: 0px;
      padding-left: 20px;

      li {
        color: black;
        list-style-type: decimal;

        a {
          color: black;
        }
      }
    }
  }
`
export const Content = styled.div`
  color: ${(props: DefaultTheme) => props.theme.app.font};
  line-height: 2.3;
  font-size: 1.1rem;
  word-break: break-all;
  word-spacing: 3px;
  a {
    text-decoration: none;
    font-weight: bold;
    color: ${(props: DefaultTheme) => props.theme.app.header} !important;
  }
  h1 {
    padding-bottom: 5px;
    font-size: 2.3rem;
    color: ${(props: DefaultTheme) => props.theme.app.header} !important;
  }
  h2 {
    font-size: 2.1rem;
  }
  h3 {
    font-size: 1.9rem;
  }
  p {
    color: ${(props: DefaultTheme) => props.theme.app.font};
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: ${(props: DefaultTheme) => props.theme.app.title};
    line-height: 40px;
  }
  p code {
    background: #dadada;
    padding: 0px 5px;
    font-weight: bold;
    color: black;
  }
  img {
    background: white;
  }
  pre {
    padding: 15px;
    border-radius: 5px;
    line-height: 20px;
    font-size: 1rem;
    font-family: 'Spoqa Han Sans Neo';
  }
  blockquote {
    border-left: 10px solid ${(props: DefaultTheme) => props.theme.app.header};
    padding: 20px;
    background-color: #edf3ef;
    margin: 0px;
    border-radius: 5px;
    font-style: oblique;
    p {
      color: #464646;
      margin: 0px;
      padding: 0px;
    }
  }

  table {
    box-shadow: 0px 0px 5px 0px;
    background-color: #f2f9ff;
    color: black;
    &,
    th,
    td {
      border: 1px solid black;
      border-collapse: collapse;
    }
    th {
      background-color: #9292ff;
      color: white;
    }
  }
`
