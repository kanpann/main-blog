import React from 'react'
import { withTheme } from '@material-ui/core'
import { styled as muiStyled } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { DefaultTheme } from '../../theme/Theme'
import { ThemeCtxConsumer } from '../provider/ThemeCtxProvider'
import Brightness3Icon from '@material-ui/icons/Brightness3'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import TopScrollBtn from './TopScrollBtn'

const MyThemeIcon = muiStyled(withTheme(IconButton))((props: DefaultTheme) => ({
  color: props.theme.app.title,
  position: 'fixed',
  bottom: 10,
  right: 20,
  background: props.theme.app.box,
  borderRadius: '8px',
  border: `2px solid black`,
  fontSize: '1.2rem',
  padding: '7px',
}))

const ThemeSwitch = () => {
  return (
    <ThemeCtxConsumer>
      {({ theme, fn }) => (
        <MyThemeIcon aria-label="display more actions" edge="end" color="inherit">
          <section onClick={fn}>
            {theme == 'light' ? (
              <>
                <Brightness3Icon viewBox="0 -6 28 28" /> <span>Dark 테마</span>
              </>
            ) : (
              <>
                <WbSunnyIcon viewBox="0 -6 28 28" /> <span>Light 테마</span>
              </>
            )}
          </section>{' '}
          | <TopScrollBtn />
        </MyThemeIcon>
      )}
    </ThemeCtxConsumer>
  )
}

export default ThemeSwitch
