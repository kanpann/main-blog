import '../theme/fonts.css'
import NextApp from 'next/app'
import React from 'react'
import TopScrollBtn from '../components/common/TopScrollBtn'
import GlobalTheme from '../theme/Global'
import { LightTheme, DarkTheme } from '../theme/Theme'
import ThemeProvider from '../components/provider/ThemeProvider'
import styled from 'styled-components'
import Header from '../components/header/Header'
import { SiteMeta } from '../site.config'
import { ThemeCtxProvider } from '../components/provider/ThemeCtxProvider'

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
    const { Component, pageProps } = this.props
    const { theme } = this.state

    const handleTransTheme = () => {
      const changeTheme = theme === 'light' ? 'dark' : 'light'
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
