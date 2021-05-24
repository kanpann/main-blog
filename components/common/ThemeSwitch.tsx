import { withTheme } from '@material-ui/core'
import { styled as muiStyled } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { DefaultTheme } from '../../theme/Theme'
import React from 'react'
import { ThemeCtxConsumer } from '../provider/ThemeCtxProvider'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import WbSunnyIcon from '@material-ui/icons/WbSunny'

const MyThemeIcon = muiStyled(withTheme(IconButton))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  paddingLeft: '10px',
}))

const ThemeSwitch = () => {
  return (
    <ThemeCtxConsumer>
      {({ theme, fn }) => (
        <MyThemeIcon onClick={fn} aria-label="display more actions" edge="end" color="inherit">
          {theme == 'light' ? (
            <WbSunnyIcon fontSize="large" />
          ) : (
            <Brightness3Icon fontSize="large" />
          )}
        </MyThemeIcon>
      )}
    </ThemeCtxConsumer>
  )
}

export default ThemeSwitch
