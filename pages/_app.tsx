import '../styles/globals.css'
import type { AppProps } from 'next/app'

const Noop = ({ children }: any) => <>{children}</>

export default function App({ Component, pageProps }: AppProps) {
  const ContextProvider = (Component as any).provider || Noop
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  )
}
