import React from 'react'
import { StylesProvider, ThemeProvider as MuiThemeProvider } from '@material-ui/styles'
import { DefaultTheme, ThemeProvider as StyledThemeProvider } from 'styled-components'

type ThemeProviderProps = {
  theme: DefaultTheme
  children: JSX.Element[] | JSX.Element
}
const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  return (
    <StylesProvider injectFirst>
      <StyledThemeProvider theme={theme}>
        <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
      </StyledThemeProvider>
    </StylesProvider>
  )
}
export default ThemeProvider
