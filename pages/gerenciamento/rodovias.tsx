import * as InsertNewHighwayModal from '@/src/components/Modal'
import Head from 'next/head'
import * as Footer from '../../src/components/Footer'
import * as FormSearch from '../../src/components/FormSearch'
import * as Header from '../../src/components/Header'
import * as RodGrid from '../../src/components/RodGrid'

import { useCallback, useEffect, useState } from 'react'
import RodImg from '../../assets/rod.png'
import { Highway } from '../../src/application/entities/highway'

let TIMEOUT_QUEUE_REF: any | null = null
let LAST_SEARCHED_TEXT = ''

export default function Rodovias() {
  const [highways, setHighways] = useState<Highway[]>([])
  const [toggleInsertHighway, setToggleInsertHighway] = useState(false)

  function handleSearchHighways(searchText: string) {
    fetch(`/api/highways?q=${searchText}`)
      .then(async highwaysFetchedResponse => {
        const highwaysFetched: Highway[] = await highwaysFetchedResponse.json()

        setHighways(highwaysFetched)
      })
      .catch(console.warn)
  }

  const handleOnChangeInputSearch = useCallback((text = '') => {
    if (LAST_SEARCHED_TEXT === text) {
      return
    }

    if (TIMEOUT_QUEUE_REF !== null) {
      clearTimeout(TIMEOUT_QUEUE_REF)
      TIMEOUT_QUEUE_REF = null
    }

    TIMEOUT_QUEUE_REF = setTimeout(() => {
      LAST_SEARCHED_TEXT = text
      handleSearchHighways(text)
    }, 300)
  }, [])

  useEffect(() => {
    handleSearchHighways('')
  }, [])

  return (
    <div className="min-h-screen w-full bg-white">
      <Head>
        <title>Proteus - Mapeamento de Rodovias</title>
      </Head>
      <div className="container relative mx-auto grid min-h-screen grid-rows-[60px,auto,70px] px-6 pb-8 pt-4">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink
              content="Gerenciamento de rodovias"
              href="/gerenciamento/rodovias"
              selected
            />
            <Header.NavLink
              content="Gerenciamento de trechos"
              href="/gerenciamento/trechos"
            />
          </Header.NavLinksContainer>
        </Header.Root>
        <InsertNewHighwayModal.Root show={toggleInsertHighway}>
          <InsertNewHighwayModal.Mask />
          <InsertNewHighwayModal.ModalContainer className="pl-10 pr-[100px]">
            <InsertNewHighwayModal.Title>
              Inserir Rodovia
            </InsertNewHighwayModal.Title>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Nome</label>
              <input
                type="text"
                autoFocus
                placeholder="Informe o nome da rodovia"
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Descrição</label>
              <textarea
                title="description"
                placeholder="..."
                rows={2}
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Possui concessionária?</label>
              <select
                placeholder="Selecione"
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              >
                <option value="" hidden defaultValue="true">
                  Selecione uma opção
                </option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Nome concessionária</label>
              <input
                type="text"
                placeholder="Informe o nome da concessionária"
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Link externo da concessionária</label>
              <input
                type="text"
                placeholder="https://"
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Descrição contatos de emergência</label>
              <textarea
                title="description"
                placeholder="..."
                rows={2}
                className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              />
            </InsertNewHighwayModal.ContainerField>

            <InsertNewHighwayModal.ContainerField>
              <div className="flex">
                <FormSearch.Button
                  type="button"
                  className="mx-0 bg-green-600 text-white hover:bg-green-500 focus:ring-green-600 sm:mx-0"
                  onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
                >
                  Salvar
                </FormSearch.Button>
                <FormSearch.Button
                  type="button"
                  className="mx-2 bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-500"
                  onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
                >
                  Cancelar
                </FormSearch.Button>
              </div>
            </InsertNewHighwayModal.ContainerField>
          </InsertNewHighwayModal.ModalContainer>
        </InsertNewHighwayModal.Root>
        <section className="flex flex-1 flex-col items-start p-3">
          <div className="flex py-2">
            <h1 className="max-w-md text-4xl font-medium text-gray-700">
              Gerenciamento de Rodovias mapeadas
            </h1>
          </div>
          <FormSearch.Root onSubmitForm={text => handleSearchHighways(text)}>
            <FormSearch.Input
              onChange={e => handleOnChangeInputSearch(e.target.value)}
            />
            <FormSearch.Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-600"
              onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="mx-1">Adicionar</span>
            </FormSearch.Button>
          </FormSearch.Root>
          <div className="flex w-full flex-1">
            <RodGrid.Root>
              {highways.map(highway => (
                <RodGrid.CardContainer
                  key={highway.id}
                  href={`/rodovias/${highway.link}`}
                >
                  <RodGrid.CardImage src={RodImg.src} />
                  <RodGrid.CardTitle>{highway.name}</RodGrid.CardTitle>
                  <RodGrid.CardDescription>
                    {highway.description}
                  </RodGrid.CardDescription>
                  <RodGrid.LinkIcon />
                </RodGrid.CardContainer>
              ))}
            </RodGrid.Root>
          </div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}
