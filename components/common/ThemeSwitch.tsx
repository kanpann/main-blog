import React from 'react'
import { withTheme } from '@material-ui/core'
import { styled as muiStyled } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { ThemeCtxConsumer } from '../provider/ThemeCtxProvider'
import DarkModeToggle from 'react-dark-mode-toggle'

const MyThemeIcon = muiStyled(withTheme(IconButton))(() => ({
  position: 'fixed',
  bottom: 10,
  right: 20,
  padding: '7px',
}))

const ThemeSwitch = () => {
  return (
    <ThemeCtxConsumer>
      {({ theme, fn }) => (
        <MyThemeIcon aria-label="display more actions" edge="end" color="inherit">
          <DarkModeToggle size={80} checked={theme !== 'light'} onChange={fn} />
        </MyThemeIcon>
      )}
    </ThemeCtxConsumer>
  )
}

export default ThemeSwitch
