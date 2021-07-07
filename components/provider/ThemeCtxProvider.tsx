import { createContext } from 'react'

const Context = createContext({ theme: 'light', fn: () => {} })

const { Provider, Consumer: ThemeCtxConsumer } = Context

type ThemeValue = {
  theme: string
  fn: () => void
}
type ThemeCtxProviderProps = {
  theme: string
  fn: () => void
  children: JSX.Element[] | JSX.Element
}
const ThemeCtxProvider = ({ theme, fn, children }: ThemeCtxProviderProps) => {
  const value: ThemeValue = {
    theme: theme,
    fn: fn,
  }
  return <Provider value={value}>{children}</Provider>
}
export { ThemeCtxProvider, ThemeCtxConsumer }
