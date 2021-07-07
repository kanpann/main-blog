import '../theme/fonts.css'
import NextApp from 'next/app'
import React from 'react'
import GlobalTheme from '../theme/Global'
import { LightTheme, DarkTheme } from '../theme/Theme'
import { ThemeCtxProvider, ThemeProvider } from '../components/provider'
import { NextComponentType, NextPageContext } from 'next'

const themes = {
  light: LightTheme,
  dark: DarkTheme,
}

export default class App extends NextApp {
  state = {
    theme: 'light',
  }
  componentDidMount() {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentNode) jssStyles.parentNode.removeChild(jssStyles)

    const savedTheme = localStorage.getItem('theme')

    savedTheme && this.setState({ theme: savedTheme })
  }
  render() {
    const {
      Component,
      pageProps,
    }: { Component: NextComponentType<NextPageContext, any, {}>; pageProps: any } = this.props
    const { theme }: { theme: string } = this.state

    const handleTransTheme = () => {
      const changeTheme: string = theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', changeTheme)
      this.setState({ theme: changeTheme })
    }
    const nowTheme = themes[theme]

    return (
      <ThemeProvider theme={nowTheme}>
        <ThemeCtxProvider theme={theme} fn={handleTransTheme}>
          <GlobalTheme />
          <Component {...pageProps} />
        </ThemeCtxProvider>
      </ThemeProvider>
    )
  }
}
