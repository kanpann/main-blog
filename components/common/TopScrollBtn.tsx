import { DefaultTheme } from '../../theme/Theme'
import styled from 'styled-components'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'

const ScrollBtn = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  color: ${(props: DefaultTheme) => props.theme.app.title};
  cursor: pointer;
  opacity: 0.7;
`

const TopScrollBtn = () => {
  const handleUpClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  const handleDownClick = () => {
    window.scrollTo({ top: 1000000, left: 0, behavior: 'smooth' })
  }
  return (
    <ScrollBtn>
      <ArrowDropUpIcon onClick={handleUpClick} fontSize="large" />
      <ArrowDropDownIcon onClick={handleDownClick} fontSize="large" />
    </ScrollBtn>
  )
}
export default TopScrollBtn
