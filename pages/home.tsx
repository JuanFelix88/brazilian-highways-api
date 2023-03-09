import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import * as Header from '../src/components/Header'
import * as Footer from '../src/components/Footer'

const Principal: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const router = useRouter()

  function handleSearch(text?: string) {
    if (text === undefined || text === '') {
      return
    }
    router.push(`/pesquisa?q=${text}`).then(console.log).catch(console.log)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <Head>
        <title>Proteus - Home</title>
      </Head>
      <div className="container relative mx-auto flex min-h-screen flex-col px-6 pb-8 pt-4">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink
              content="Gerenciamento de rodovias"
              href="/gerenciamento/rodovias"
            />
            <Header.NavLink
              content="Gerenciamento de trechos"
              href="/gerenciamento/trechos"
            />
          </Header.NavLinksContainer>
        </Header.Root>
        <section className="flex flex-1 items-center">
          <div className="flex w-full flex-col ">
            <h1 className="text-center text-5xl font-extrabold lg:text-7xl 2xl:text-8xl">
              <span className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                Você procura, você acha!
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-gray-700 md:text-xl">
              Procure por trecho das principais rodovias brasileiras!
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0"
            >
              <input
                type="text"
                autoFocus
                className="w-80 rounded-md border bg-white px-3 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:mx-2"
                placeholder="BR-116, km 10"
                onChange={e => setSearchText(e.target.value)}
              />
              <button
                onClick={() => handleSearch(searchText)}
                className="flex transform items-center rounded-md bg-red-500 px-4 py-3 text-lg font-medium capitalize tracking-wide text-white transition-colors duration-300 hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-1 sm:mx-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mx-1 h-6 w-6"
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
              className="mt-8 text-center text-lg text-gray-700 hover:text-red-700 md:text-lg"
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
