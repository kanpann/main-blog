import { createContext } from "react"

const Context = createContext({theme: 'light', fn:() => {}})

const { Provider, Consumer: ThemeCtxConsumer } = Context

type ThemeCtxProviderProps = {
  theme: string
  fn: () => void
  children: JSX.Element[] | JSX.Element
}
const ThemeCtxProvider = ({ theme, fn, children }: ThemeCtxProviderProps) => {
    const value = {
        theme: theme,
        fn: fn
    }
    return (
        <Provider value={value}>
            {children}
        </Provider>
    )
}
export {
    ThemeCtxProvider,
    ThemeCtxConsumer
}