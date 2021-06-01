import styled from 'styled-components'

const Frame = styled.div`
  text-align: center;
  text-shadow: black 0px 0px 1px;
  padding-bottom: 20px;
  padding-top: 10px;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  a {
    color: #cacaca;
  }
`
type FooterProps = {
  github: string
  author: string
}
const Footer = ({ github, author }) => {
  return (
    <Frame>
      ©<a href={github}>{author}</a>, Built with{' '}
      <a href="https://github.com/gunkims/gunlog">gunlog</a>
    </Frame>
  )
}

export default Footer
