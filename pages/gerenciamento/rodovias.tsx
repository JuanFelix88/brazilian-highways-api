import Head from 'next/head'
import * as Header from '../../src/components/Header'
import * as Footer from '../../src/components/Footer'
import * as FormSearch from '../../src/components/FormSearch'
import * as RodGrid from '../../src/components/RodGrid'
import * as InsertNewHighwayModal from '../../src/components/Modal'

import RodImg from '../../assets/rod.png'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { Highway } from '../../src/entities/highway'

let TIMEOUT_QUEUE_REF: any | null = null
let LAST_SEARCHED_TEXT = ''

export default function Rodovias () {
  const [highways, setHighways] = useState<Highway[]>([])
  const [toggleInsertHighway, setToggleInsertHighway] = useState(false)

  function handleSearchHighways (searchText: string) {
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
    <div className="w-full min-h-screen bg-white">
      <Head>
        <title>Proteus - Mapeamento de Rodovias</title>
      </Head>
      <div className="container relative min-h-screen px-6 pb-8 pt-4 mx-auto grid grid-rows-[60px,auto,70px]">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink content="Gerenciamento de rodovias" href="/gerenciamento/rodovias" selected/>
            <Header.NavLink content="Gerenciamento de trechos" href="/gerenciamento/trechos" />
          </Header.NavLinksContainer>
        </Header.Root>
        <InsertNewHighwayModal.Root show={toggleInsertHighway}>
          <InsertNewHighwayModal.Mask />
          <InsertNewHighwayModal.ModalContainer>
            <InsertNewHighwayModal.Title>
              Inserir Rodovia
            </InsertNewHighwayModal.Title>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Nome</label>
              <input
                type="text"
                autoFocus
                placeholder='Informe o nome da rodovia'
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Descrição</label>
              <textarea
                title='description'
                placeholder='...'
                rows={3}
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Possui concessionária?</label>
              <select
                placeholder='Selecione'
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              >
                <option value="" hidden defaultValue='true'></option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Nome concessionária</label>
              <input
                type="text"
                placeholder='Informe o nome da concessionária'
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Link externo da concessionária</label>
              <input
                type="text"
                placeholder='https://'
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
            </InsertNewHighwayModal.ContainerField>
            <InsertNewHighwayModal.ContainerField>
              <label htmlFor="">Descrição contatos de emergência</label>
              <textarea
                title='description'
                placeholder='...'
                rows={3}
                className="my-2 px-2 py-3 w-96 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
              />
            </InsertNewHighwayModal.ContainerField>

            <InsertNewHighwayModal.ContainerField>
              <div className='flex'>
                <FormSearch.Button
                  type='button'
                  className='bg-green-600 text-white hover:bg-green-500 focus:ring-green-600 sm:mx-0 mx-0'
                  onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
                >
                  Salvar
                </FormSearch.Button>
                <FormSearch.Button
                  type='button'
                  className='bg-gray-500 text-white hover:bg-gray-400 focus:ring-gray-500 mx-2'
                  onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
                >
                  Cancelar
                </FormSearch.Button>
              </div>

            </InsertNewHighwayModal.ContainerField>
          </InsertNewHighwayModal.ModalContainer>
        </InsertNewHighwayModal.Root>
        <section className="flex flex-1 p-3 flex-col items-start">
          <div className='flex py-2'>
            <h1 className='text-4xl font-medium text-gray-700 max-w-md' >
              Gerenciamento de Rodovias mapeadas
            </h1>
          </div>
          <FormSearch.Root onSubmitForm={text => handleSearchHighways(text)}>
            <FormSearch.Input
              onChange={e => handleOnChangeInputSearch(e.target.value)}
            />
            <FormSearch.Button
              type='button'
              className='bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-600'
              onClick={() => setToggleInsertHighway(!toggleInsertHighway)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className='mx-1'>Adicionar</span>
            </FormSearch.Button>
          </FormSearch.Root>
          <div className='flex flex-1 w-full'>
          <RodGrid.Root>
            {highways.map((highway) => (
              <RodGrid.CardContainer key={highway.id} href={`/rodovias/${highway.link}`}>
                <RodGrid.CardImage src={RodImg.src}/>
                <RodGrid.CardTitle>{highway.name}</RodGrid.CardTitle>
                <RodGrid.CardDescription>{highway.description}</RodGrid.CardDescription>
                <RodGrid.LinkIcon />
              </RodGrid.CardContainer>)
            )}
          </RodGrid.Root>
        </div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}
