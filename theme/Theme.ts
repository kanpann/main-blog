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
    background: 'rgb(65 130 249)',
    font: '#676767',
    a: 'black',
    title: 'black',
    box: 'white',
    card: 'white'
  },
}
export const DarkTheme = {
  ...darkTheme,
  app: {
    background: '#011931',
    font: '#ababab',
    a: '',
    title: 'white',
    box: '#0a0f1b',
    card: '#011931'
  },
}

export type DefaultTheme = {
  theme: typeof DarkTheme;
}