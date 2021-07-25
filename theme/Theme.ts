import { createMuiTheme, Theme as MuiTheme } from '@material-ui/core/styles'

const lightTheme: MuiTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#6666ff',
    },
  },
})
const darkTheme: MuiTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6666ff',
    },
  },
})

export const LightTheme = {
  ...lightTheme,
  app: {
    background: '#e4ffcb',
    font: '#484848',
    a: '#a5ffa0',
    header: '#2abb19',
    toc: 'rgb(237 255 240 / 80%)',
    title: 'black',
    box: 'white',
    card: 'white',
  },
}
export const DarkTheme = {
  ...darkTheme,
  app: {
    background: '#011931',
    font: '#ababab',
    a: '#c3626f',
    header: '#d46262',
    toc: 'rgb(187 208 255 / 80%)',
    title: 'white',
    box: '#0a0f1b',
    card: '#011931',
  },
}

export type DefaultTheme = {
  theme: typeof DarkTheme
}
