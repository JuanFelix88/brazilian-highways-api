import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import * as Header from '../src/components/Header'
import * as Footer from '../src/components/Footer'

const Principal: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  function handleSearch (text?: string) {
    if (text === undefined || text === '') {
      return
    }
    router.push(`/pesquisa?q=${text}`).then(console.log).catch(console.log)
  }

  function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Head>
        <title>Mapper - Home</title>
      </Head>
      <div className="container relative flex flex-col min-h-screen px-6 pb-8 pt-4 mx-auto">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink content="Gerenciamento de rodovias" href="/gerenciamento/rodovias" />
            <Header.NavLink content="Gerenciamento de trechos" href="/gerenciamento/trechos" />
          </Header.NavLinksContainer>
        </Header.Root>
        <section className="flex items-center flex-1">
          <div className="flex flex-col w-full ">
            <h1 className="text-5xl font-extrabold text-center lg:text-7xl 2xl:text-8xl">
              <span className="text-transparent bg-gradient-to-br bg-clip-text from-red-600 via-red-500 to-orange-500">
                Você procura, você acha!
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-lg text-center text-gray-700 md:text-xl">
              Procure por trecho das principais rodovias brasileiras!
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col mt-8 space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0"
            >
              <input
                type="text"
                autoFocus
                className="px-3 py-3 w-80 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring sm:mx-2"
                placeholder="BR-116, km 10"
                onChange={e => setSearchText(e.target.value)}
              />
              <button
                onClick={() => handleSearch(searchText)}
                className="flex focus:ring-2 focus:ring-red-600 focus:ring-offset-1 items-center px-4 py-3 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-500 rounded-md hover:bg-red-600 focus:bg-red-600 focus:outline-none sm:mx-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mx-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Encontrar!
              </button>
            </form>
            <a
              className="mt-8 text-center text-gray-700 text-lg md:text-lg hover:text-red-700"
              href="/rodovias"
            >
              Veja a nossa lista de rodovias mapeadas.
            </a>
          </div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}

export default Principal
