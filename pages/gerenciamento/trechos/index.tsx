import * as SelectHighwayModal from '@/src/components/Modal'
import Head from 'next/head'
import * as Footer from '../../../src/components/Footer'
import * as FormSearch from '../../../src/components/FormSearch'
import * as Header from '../../../src/components/Header'

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { Highway } from '../../../src/application/entities/highway'

export default function Trechos() {
  const [selectedHighway, setSelectedHighway] = useState<Highway | null>(null)
  const router = useRouter()
  const [highways, setHighways] = useState<Highway[]>([])

  useEffect(() => {
    fetch('/api/highways').then(async fetchHighwaysResponse => {
      if (fetchHighwaysResponse.status >= 400) {
        alert('Ocorreu um erro durante o carregamento das rodovias.')
        return
      }

      const highwaysFetched: Highway[] = await fetchHighwaysResponse.json()

      setHighways(highwaysFetched)
    })
  }, [])

  function handleOnChangeSelectedHighway(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedHighway(
      highways.find(highway => highway.id === Number(event.target.value)) ??
        null
    )
  }

  function handleToInitializeMapping() {
    router.push(
      `/gerenciamento/trechos/mapeamento-proteus?id=${selectedHighway!.id}`
    )
  }

  const hasHighwaySelected = Boolean(selectedHighway)

  return (
    <div className="min-h-screen w-full bg-white">
      <Head>
        <title>Proteus - Mapeamento de Trechos</title>
      </Head>
      <SelectHighwayModal.Root show>
        <SelectHighwayModal.Mask />
        <SelectHighwayModal.ModalContainer>
          <SelectHighwayModal.Title>
            Rodovia a ser Mapeada
          </SelectHighwayModal.Title>
          <SelectHighwayModal.ContainerField>
            <label htmlFor="">Nome da Rodovia</label>
            <select
              placeholder="Selecione"
              className="my-2 w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
              onChange={handleOnChangeSelectedHighway}
            >
              <option value="" hidden defaultValue="true">
                Selecione uma opção
              </option>
              {highways.map(highway => (
                <option key={highway.id} value={highway.id}>
                  {highway.name}
                </option>
              ))}
            </select>
          </SelectHighwayModal.ContainerField>
          <SelectHighwayModal.ContainerField>
            <FormSearch.Button
              type="button"
              disabled={!hasHighwaySelected}
              className="
                disabled:focus-ring-white
                  mx-0 flex
                justify-center bg-green-600
                text-white
                  hover:bg-green-500 focus:ring-green-600
                disabled:bg-green-300
                disabled:hover:bg-green-300
                  sm:mx-0
                "
              onClick={handleToInitializeMapping}
            >
              Começar a Mapear
            </FormSearch.Button>
          </SelectHighwayModal.ContainerField>
        </SelectHighwayModal.ModalContainer>
      </SelectHighwayModal.Root>
      <div className="container relative mx-auto grid min-h-screen grid-rows-[60px,auto,70px] px-6 pb-8 pt-4">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink
              content="Gerenciamento de rodovias"
              href="/gerenciamento/rodovias"
            />
            <Header.NavLink
              content="Gerenciamento de trechos"
              href="/gerenciamento/trechos"
              selected
            />
          </Header.NavLinksContainer>
        </Header.Root>

        <section className="flex flex-1 flex-col items-start p-3">
          <div className="flex py-2">
            <h1 className="max-w-md text-4xl font-medium text-gray-700">
              Rodovia: {selectedHighway?.name}
            </h1>
          </div>
          <div className="flex w-full flex-1"></div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}
