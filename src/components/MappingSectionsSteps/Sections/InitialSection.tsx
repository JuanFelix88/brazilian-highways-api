import { useMapping } from '@/src/contexts/Proteus/Mapping'
import Description from '../Description'
import Title from '../Title'
import ButtonStep from '../ButtonStep'

export default function InitialSection() {
  const {
    pointers,
    mappedPointers,
    pluginAlready,
    keyPointers,
    pluginWorkComplete,
    highwayDistance,
    totalTime,
    setSteps,
    steps
  } = useMapping()

  const isEmptyPointers = !pointers.length
  const isCompleteMappedPointers =
    Boolean(pointers.length) && mappedPointers.length === pointers.length

  function handleClickContinueButton() {
    const newSteps = steps
      .map(step =>
        step.text.startsWith('1.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('2.') ? { ...step, state: 'running' } : step
      )
    setSteps(newSteps as [])
  }

  return (
    <div className="flex flex-col py-5 px-8">
      {!pluginAlready && !isCompleteMappedPointers && (
        <>
          <Title>Aguardando conexão com o Plugin...</Title>
          <Description>
            Se não atualizar em 5 segundos, recarregue a página.
          </Description>
        </>
      )}
      {pluginAlready && isEmptyPointers && (
        <>
          <Title>Plugin pronto para ser utilizado.</Title>
          <Description>Aguardando o início do mapeamento.</Description>
        </>
      )}
      {pluginAlready && !isCompleteMappedPointers && !isEmptyPointers && (
        <>
          <Title>
            Mapeado {mappedPointers.length} pontos de um total de{' '}
            {pointers.length} pontos...
          </Title>
          <Description>
            Em processo de mapeamento através do Bing plugin.
          </Description>
        </>
      )}
      {pluginAlready && isCompleteMappedPointers && !pluginWorkComplete && (
        <>
          <Title>
            Encontrado {keyPointers.length} pontos chaves de um total de{' '}
            {pointers.length} pontos...
          </Title>
          <Description>
            Ainda em processo de mapeamento através do Bing plugin...
          </Description>
        </>
      )}
      {pluginWorkComplete && (
        <>
          <Title>Mapeamento completo.</Title>
          <Description>
            <>
              <p>
                Extensão da rodovia: {(highwayDistance ?? 0).toLocaleString()}{' '}
                km
              </p>
              <p>
                Tempo total:{' '}
                {
                  new Date(totalTime ?? 0)
                    .toLocaleTimeString('pt-BR')
                    .match(/.*([0-9]{2}:[0-9]{2})$/)?.[1]
                }
              </p>
              <p>Total de pontos: {pointers.length}</p>
              <p>Total de pontos chaves: {keyPointers.length}</p>
              <ButtonStep
                className="my-1 mx-0 w-fit active:bg-gray-200"
                onClick={handleClickContinueButton}
              >
                Prosseguir para a próxima etapa
              </ButtonStep>
            </>
          </Description>
        </>
      )}
    </div>
  )
}
