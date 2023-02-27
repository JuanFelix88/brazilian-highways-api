import { useMapping } from '@/src/contexts/Proteus/Mapping'
import ButtonStep from '../ButtonStep'
import Description from '../Description'
import Title from '../Title'

export default function EndConfirmSection() {
  const { keyPointers, setSteps, steps } = useMapping()

  function handleConfirmChanges() {
    alert('Finalizado!')
  }

  function handleReturnToFirstStep() {
    setSteps(
      steps
        .map(step => ({ ...step, state: 'default' }))
        .map(step =>
          step.text.startsWith('1.') ? { ...step, state: 'running' } : step
        ) as []
    )
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
          onClick={handleConfirmChanges}
          className="my-1 bg-green-500 hover:bg-green-400"
        >
          Concluir mapeamento!
        </ButtonStep>
      </div>
    </div>
  )
}
