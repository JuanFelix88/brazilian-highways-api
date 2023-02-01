import Head from 'next/head'
import * as Header from '../../src/components/Header'
import * as Footer from '../../src/components/Footer'
import * as FormSearch from '../../src/components/FormSearch'
import * as RodGrid from '../../src/components/RodGrid'

import RodImg from '../../assets/rod.png'

const highways = [
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  },
  {
    id: 'stringasdas',
    link: '#',
    name: 'Régis Bittencourt',
    description: 'Teste de renderização de rodovia'
  }

]

export default function Rodovias () {
  function handleOnChangeTextSearch (searchText: string) {
    console.log({
      searchText
    })
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Head>
        <title>Mapper - Mapeamento de Rodovias</title>
      </Head>
      <div className="container relative min-h-screen px-6 pb-8 pt-4 mx-auto grid grid-rows-[60px,auto,70px]">
        <Header.Root>
          <Header.NavLinksContainer>
            <Header.NavLink content="Gerenciamento de rodovias" href="/gerenciamento/rodovias" selected/>
            <Header.NavLink content="Gerenciamento de trechos" href="/gerenciamento/trechos" />
          </Header.NavLinksContainer>
        </Header.Root>
        <section className="flex flex-1 p-3 flex-col items-start">
          <div className='flex py-2'>
            <h1 className='text-4xl font-medium text-gray-700 max-w-md' >
              Gerenciamento de Rodovias mapeadas
            </h1>
          </div>
          <FormSearch.Root onSubmitForm={text => handleOnChangeTextSearch(text)}>
            <FormSearch.Input />
            <FormSearch.Button className='bg-indigo-600 text-white hover:bg-indigo-400 focus:ring-indigo-600'>
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
