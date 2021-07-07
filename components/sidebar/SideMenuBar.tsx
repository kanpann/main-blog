import React from 'react'
import { Avatar, Grid, IconButton, withTheme } from '@material-ui/core'
import { SiteMeta } from '../../site.config'
import Categories from './Categories'
import { styled as muiStyled } from '@material-ui/core/styles'
import styled, { SideBarTheme } from 'styled-components'
import { DefaultTheme } from '../../theme/Theme'
import Social from './Social'
import SearchForm from './SearchForm'
import CloseIcon from '@material-ui/icons/Close'
import { SiteInfoType } from '../../types/config'

const MainFrame = styled.div`
  background-color: ${(props: SideBarTheme) => props.theme.app.box};
  ${(props: SideBarTheme) => (props.isBorder ? 'border: 1px solid gray' : '')};
  ${(props: SideBarTheme) =>
    props.whiteSpace == 'normal' ? 'padding-top: 50px' : 'padding-top: 100px'};
`
const BackButton = muiStyled(withTheme(IconButton))({
  position: 'fixed',
  top: 10,
  left: 10,
})
const MyAvatar = muiStyled(withTheme(Avatar))({
  width: '150px',
  height: '150px',
  margin: '0 auto',
})
const Name = styled.div`
  font-size: 1.5rem;
  padding-top: 10px;
  padding-bottom: 10px;
  color: ${(props: DefaultTheme) => props.theme.app.title};
`
const InfoFrame = styled.div`
  text-align: center;
  color: ${(props: DefaultTheme) => props.theme.app.font};
`
const Contents = styled.p`
  width: 80%;
  margin: 0 auto;
  word-break: keep-all;
  color: ${(props: DefaultTheme) => props.theme.app.font};
`

type SideMenuProps = {
  isBorder?: boolean
  whiteSpace?: 'normal' | 'large'
  handleClose?: () => void
}
const SideMenuBar = ({ isBorder, whiteSpace = 'normal', handleClose }: SideMenuProps) => {
  const { github, email, author, descript, image }: SiteInfoType = SiteMeta.info
  return (
    <MainFrame isBorder={isBorder} whiteSpace={whiteSpace}>
      <Grid
        style={{ padding: '10px' }}
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <Grid>
          <InfoFrame>
            <MyAvatar src={image} />
            <Name>{author}</Name>
            <Contents>{descript}</Contents>
            <Social github={github} email={email} />
            <SearchForm />
          </InfoFrame>
        </Grid>
        <Grid style={{ width: '80%' }}>
          <Categories />
        </Grid>
      </Grid>
      {handleClose && (
        <BackButton onClick={handleClose}>
          <CloseIcon color="inherit" viewBox="5 5 15 15" />
        </BackButton>
      )}
    </MainFrame>
  )
}
export default SideMenuBar
