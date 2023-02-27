import { PluginMessageProtocol } from '@/src/application/entities/plugin-message-protocol'
import * as Footer from '@/src/components/Footer'
import * as Header from '@/src/components/Header'
import EndConfirmSection from '@/src/components/MappingSectionsSteps/Sections/EndConfirmSection'
import InitialSection from '@/src/components/MappingSectionsSteps/Sections/InitialSection'
import Verify50KilometersMarkersSection from '@/src/components/MappingSectionsSteps/Sections/Verify50KilometersMarkersSection'
import VerifyLowPrecisionPointers from '@/src/components/MappingSectionsSteps/Sections/VerifyLowPrecisionPointers'
import VerifyMissingPointersSection from '@/src/components/MappingSectionsSteps/Sections/VerifyMissingPointersSection'
import StepProgress from '@/src/components/StepProgress'
import { MappingProvider, useMapping } from '@/src/contexts/Proteus/Mapping'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Highway } from '../../../../src/application/entities/highway'
import highways from '../../../../src/data/highways.json'

interface Props {
  highway: Highway | null
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const highway =
    highways.find(highway => Number(ctx.query.id) === highway.id) ?? null

  return {
    props: {
      highway
    }
  }
}

MapeamentoProteus.provider = MappingProvider

export default function MapeamentoProteus({ highway }: Props) {
  const {
    steps,
    setPointers,
    setMappedPointers,
    mappedPointers,
    setPluginAlready,
    setKeyPointers,
    pluginAlready,
    keyPointers,
    setPluginWorkComplete,
    setHighwayDistance,
    setTotalTime
  } = useMapping()
  const [pluginWindow, setPluginWindow] = useState<Window | null>(null)

  function handlePluginMessages({
    data: pluginEvent
  }: {
    data: PluginMessageProtocol
  }) {
    if (pluginEvent.type === 'set-pointers') {
      const { pointers } =
        pluginEvent.data as PluginMessageProtocol.DataTransfer.SetPointers
      setPointers(pointers)
    }

    if (pluginEvent.type === 'set-mapped-pointers') {
      const { pointers } =
        pluginEvent.data as PluginMessageProtocol.DataTransfer.SetMappedPointers

      setMappedPointers(pointers)
    }

    if (pluginEvent.type === 'set-key-pointers') {
      const { pointers } =
        pluginEvent.data as PluginMessageProtocol.DataTransfer.SetKeyPointers

      setKeyPointers(pointers)
    }

    if (pluginEvent.type === 'plugin-listening+') {
      setPluginAlready(true)
    }

    if (pluginEvent.type === 'concluded+') {
      const { highwayDistance, totalTime } =
        pluginEvent.data as PluginMessageProtocol.DataTransfer.Concluded
      setHighwayDistance(highwayDistance)
      setTotalTime(totalTime)
      setPluginWorkComplete(true)
      pluginWindow?.close()
    }
  }

  useEffect(() => {
    window.onmessage = handlePluginMessages
    return () => undefined
  }, [steps, mappedPointers, keyPointers, pluginAlready])

  useEffect(() => {
    const openedWindowPlugin = open(
      'https://www.bing.com/maps?proteus=true',
      `map-rod-${highway!.id}`,
      'width=1000,height=750'
    )

    setPluginWindow(openedWindowPlugin)
    setTimeout(
      () =>
        window.postMessage(
          {
            type: 'app-listening+',
            data: null,
            from: 'app'
          } as PluginMessageProtocol,
          window.location.origin
        ),
      800
    )
  }, [])

  const isInitialSectionRunning = steps.some(
    step => step.text.startsWith('1.') && step.state === 'running'
  )
  const isVerifyMissingPointersSectionRunning = steps.some(
    step => step.text.startsWith('2.') && step.state === 'running'
  )
  const isVerify50MarkersSectionRunning = steps.some(
    step => step.text.startsWith('3.') && step.state === 'running'
  )
  const isVerifyLowPrecisionPointers = steps.some(
    step => step.text.startsWith('4.') && step.state === 'running'
  )
  const isAllStepsConcludes = !steps.some(step => step.state !== 'concluded')

  return (
    <div className="min-h-screen w-full bg-white">
      <Head>
        <title>Proteus - Mapeamento de Trechos</title>
        <meta name="referrer" content="same-origin" />
        <meta name="referrer" content="same-origin" />
      </Head>
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
              Rodovia: {highway?.name}
            </h1>
          </div>
          <div className="flex w-full flex-1 flex-col">
            <ul className="py-5 px-2">
              {steps.map(step => (
                <StepProgress key={step.text} options={step} />
              ))}
            </ul>
            <div className="mx-3 w-full border-b border-gray-300" />
            {isInitialSectionRunning && <InitialSection />}
            {isVerifyMissingPointersSectionRunning && (
              <VerifyMissingPointersSection />
            )}
            {isVerify50MarkersSectionRunning && (
              <Verify50KilometersMarkersSection />
            )}
            {isVerifyLowPrecisionPointers && <VerifyLowPrecisionPointers />}
            {isAllStepsConcludes && <EndConfirmSection />}
          </div>
        </section>
        <Footer.Root />
      </div>
    </div>
  )
}
