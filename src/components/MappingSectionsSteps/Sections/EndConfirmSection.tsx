import { useMapping } from '@/src/contexts/Proteus/Mapping'
import { useRouter } from 'next/router'
import ButtonStep from '../ButtonStep'
import Description from '../Description'
import Title from '../Title'

export default function EndConfirmSection() {
  const { keyPointers, setSteps, steps } = useMapping()
  const router = useRouter()

  function handleReturnToFirstStep() {
    setSteps(
      steps
        .map(step => ({ ...step, state: 'default' }))
        .map(step =>
          step.text.startsWith('1.') ? { ...step, state: 'running' } : step
        ) as []
    )
  }

  function handleSubmitKeypointers() {
    const { id: highwayId } = router.query

    fetch('/api/highways/mapping/parts', {
      method: 'POST',
      body: JSON.stringify(
        keyPointers.map(keypointer => ({
          ...keypointer,
          rodId: Number(highwayId)
        }))
      ),
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(async fetchPostKeypointersResponse => {
        if (fetchPostKeypointersResponse.status !== 202) {
          return alert('Não foi possível salvar os dados devido erro interno')
        }

        alert('Dados salvos com sucesso')
        await router.push('/gerenciamento/trechos')
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="flex flex-col py-5 px-8">
      <Title>Confirmar mapeamento completo da Rodovia</Title>
      <Description>
        Serão incluídos um total de {keyPointers.length} pontos na base de
        dados.
      </Description>
      <div className="flex w-fit flex-col px-1 py-3">
        <ButtonStep onClick={handleReturnToFirstStep} className="my-1 w-fit">
          Retornar para a primeira etapa
        </ButtonStep>
        <ButtonStep
          onClick={handleSubmitKeypointers}
          className="my-1 bg-green-500 hover:bg-green-400"
        >
          Concluir mapeamento!
        </ButtonStep>
      </div>
    </div>
  )
}
