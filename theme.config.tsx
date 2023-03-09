import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  toc: {
    float: true
  },
  logo: () => (
    <>
      <img
        src="/project-icon.png"
        height="35"
        width="35"
        style={{ marginRight: '1em' }}
      />
      <h1>
        Brazilian Highways API <span style={{ opacity: 0.2 }}></span>
      </h1>
    </>
  ),
  useNextSeoProps() {
    return {
      titleTemplate: '%s | Brazilian Highways API'
    }
  },
  head: () => {
    return (
      <>
        <meta name="theme-color" content="#000" />
        <link rel="apple-touch-icon" sizes="180x180" href="/javascript.svg" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="description" content="Documentação d" />
        <meta
          name="description"
          content="Rodovias brasileiras disponíveis públicamente através de uma API"
        />
        <meta name="author" content="Juan Felix" />
        <meta
          property="og:url"
          content="https://brazilizan-highways-api.vercel.app"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="692" />
        <meta property="og:title" content={`Brazilian Highways API`} />
        <meta
          property="og:description"
          content="Rodovias brasileiras disponíveis públicamente através de uma API"
        />
        <meta property="og:image" content="https://i.imgur.com/PvJSMet.png" />
      </>
    )
  },
  project: {
    link: 'https://github.com/juanfelix88/brazilian-highways-api'
  },
  docsRepositoryBase: 'https://github.com/juanfelix88/brazilian-highways-api',
  footer: {
    text: `${new Date().getFullYear()} © Brazilian Highways API.`
  },
  nextThemes: {
    defaultTheme: 'light'
  }
}

export default config
