import { Highway as HighwayZod } from '@/src/infra/http/dtos/highway-schema'
import Head from 'next/head'
import * as Footer from '../../src/components/Footer'
import * as FormSearch from '../../src/components/FormSearch'
import * as Header from '../../src/components/Header'
import * as RodGrid from '../../src/components/RodGrid'

import { Highway } from '@/src/application/entities/highway'
import InsertNewHighwayModal from '@/src/components/Highways/InserNewHighwayModal'
import { useCallback, useEffect, useState } from 'react'
import RodImg from '../../assets/rod.png'
import { useRouter } from 'next/router'
import EditHighwayModal from '@/src/components/Highways/EditHighwayModal'
import Link from 'next/link'

let TIMEOUT_QUEUE_REF: any | null = null
let LAST_SEARCHED_TEXT = ''

export default function Rodovias() {
  const [highways, setHighways] = useState<Highway[]>([])
  const [toggleInsertHighway, setToggleInsertHighway] = useState(false)
  const [toggleEditHighway, setToggleEditHighway] = useState(false)

  const router = useRouter()

  const highwayId = router.query.id as string | undefined
  const selectedHighway = highways.find(({ id }) => id === Number(highwayId))

  function handleSearchHighways(searchText = '') {
    fetch(`/api/highways?q=${searchText}`)
      .then(async highwaysFetchedResponse => {
        if (highwaysFetchedResponse.status === 404) {
          setHighways([])
          return
        }

        const highwaysFetched: Highway[] = await highwaysFetchedResponse.json()

        setHighways(highwaysFetched)
      })
      .catch(console.error)
  }

  function handleSubmitCreateHighway({
    code,
    concessionaireLink,
    concessionaireName,
    description,
    emergencyContacts,
    hasConcessionaire,
    name
  }: HighwayZod) {
    fetch(`/api/highways`, {
      method: 'POST',
      body: JSON.stringify({
        code,
        concessionaireLink,
        concessionaireName,
        description,
        emergencyContacts,
        hasConcessionaire,
        name
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(createHighwayResponse => {
        if (createHighwayResponse.status >= 400) {
          alert('Erro ao salvar a rodovia')
          return
        }

        if (createHighwayResponse.status === 201) {
          setToggleInsertHighway(false) // hidden modal
          alert('Rodovia salva com sucesso')
          handleSearchHighways('') // refresh list view
          return
        }

        alert(
          'Ocorreu um erro desconhecido durante o processo de salvar a rodovia no sistema.'
        )
      })
      .catch(console.warn)
  }

  function handleSubmitEditHighway({
    id,
    code,
    concessionaireLink,
    concessionaireName,
    description,
    emergencyContacts,
    hasConcessionaire,
    name
  }: HighwayZod & { id: number }) {
    fetch(`/api/highways/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        code,
        concessionaireLink,
        concessionaireName,
        description,
        emergencyContacts,
        hasConcessionaire,
        name
      }),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(editHighwayResponse => {
        if (editHighwayResponse.status >= 400) {
          alert('Erro ao salvar a rodovia')
          return
        }

        if (editHighwayResponse.status === 200) {
          setToggleEditHighway(false) // hidden modal
          alert('Dados salvos com sucesso')
          handleSearchHighways('') // refresh list view
          return
        }

        alert(
          'Ocorreu um erro desconhecido durante o processo de alterar a rodovia no sistema.'
        )
      })
      .catch(console.warn)
  }

  function handleSubmitDeleteHighway({ id }: { id: number }) {
    const confirmation = confirm('Deseja realmente excluir essa rodovia?')

    if (!confirmation) {
      return
    }

    fetch(`/api/highways/${id}`, {
      method: 'DELETE'
    }).then(deleteHighwayResponse => {
      if (deleteHighwayResponse.status >= 400) {
        alert(
          `Ocorreu um erro durante a operação de exclusão da rodovia, tente novamente ou procure uma solução para o problema. Status [${deleteHighwayResponse.status}]`
        )
        return
      }

      if (deleteHighwayResponse.status === 200) {
        alert('Rodovia excluída com sucesso!')
        setToggleEditHighway(false)
        handleSearchHighways('')
        return
      }

      alert(
        'Ocorreu um erro desconhecido durante o processo de alterar a rodovia no sistema.'
      )
    })
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
    setToggleEditHighway(Boolean(highwayId) && Boolean(selectedHighway))
  }, [highwayId])

  useEffect(() => {
    handleSearchHighways('')
  }, [])

  return (
    <div className="min-h-screen w-full bg-white">
      <Head>
        <title>Proteus - Mapeamento de Rodovias</title>
      </Head>

      <InsertNewHighwayModal
        handleOnReset={() => setToggleInsertHighway(false)}
        handleOnSubmit={handleSubmitCreateHighway}
        show={toggleInsertHighway}
      />
      <EditHighwayModal
        handleOnDelete={handleSubmitDeleteHighway}
        handleOnSubmit={handleSubmitEditHighway}
        handleOnReset={() => {
          router.push('/gerenciamento/rodovias') // reset
          setToggleEditHighway(false)
        }}
        highwayData={selectedHighway}
        highwayId={highwayId ? Number(highwayId) : undefined}
        show={toggleEditHighway}
      />
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
                <Link
                  key={highway.id}
                  href={`/gerenciamento/rodovias?id=${highway.id}`}
                >
                  <RodGrid.CardContainer href={`/rodovias/${highway.code}`}>
                    <RodGrid.CardImage src={RodImg.src} />
                    <RodGrid.CardTitle>{highway.name}</RodGrid.CardTitle>
                    <RodGrid.CardDescription>
                      {highway.description}
                    </RodGrid.CardDescription>
                    <RodGrid.LinkIcon />
                  </RodGrid.CardContainer>
                </Link>
              ))}
            </RodGrid.Root>
          </div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}
