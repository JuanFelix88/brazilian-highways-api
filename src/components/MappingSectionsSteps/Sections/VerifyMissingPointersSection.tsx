import { Pointer } from '@/src/application/entities/pointer'
import { useMapping } from '@/src/contexts/Proteus/Mapping'
import { useState } from 'react'
import ButtonStep from '../ButtonStep'
import Description from '../Description'
import Title from '../Title'

const COUNT_TO_CORRECT_TOTAL_KEY_POINTERS = 1

export default function VerifyMissingPointersSection() {
  const {
    pointers,
    keyPointers,
    setKeyPointers,
    highwayDistance: highwayDistanceToGetCountPointers,
    setSteps,
    steps
  } = useMapping()
  const [pointersToWork, setPointersToWork] = useState<Array<Partial<Pointer>>>(
    [
      ...Array(
        Number.parseInt(String(highwayDistanceToGetCountPointers ?? 0), 10) +
          COUNT_TO_CORRECT_TOTAL_KEY_POINTERS
      )
    ]
      .map((_, indexToMapToKm) => indexToMapToKm)
      .map(
        km =>
          keyPointers.find(keyPointer => keyPointer.km === km) ?? {
            km,
            majority: true,
            kmDistance: km,
            position: undefined
          }
      )
  )

  function handleOnClickEditMarkerPosition(
    index: number,
    { position, km }: Partial<Pointer>
  ) {
    const defaultValue = (position ?? [0, 0]).join(', ')
    const val = prompt(
      `Informe o novo valor para a posição #${index}: `,
      defaultValue
    )

    if (
      val === null ||
      typeof val !== 'string' ||
      val === defaultValue ||
      !val
    ) {
      return
    }

    if (val === '.') {
      setPointersToWork(
        pointersToWork.map(missingPointer =>
          missingPointer.km === km
            ? { ...missingPointer, position: undefined }
            : missingPointer
        )
      )
      return
    }

    if (
      !/^(-)?[0-9]{1,}(\.[0-9]{1,})?,(\s)?(-)?[0-9]{1,}(\.[0-9]{1,})?$/.test(
        val
      )
    ) {
      alert(
        'O valor não será setado por que não está dentro dos padrões -0.000, 0.000'
      )
      return
    }

    const newPosition: [number, number] = JSON.parse(`[${val}]`)

    setPointersToWork(
      pointersToWork.map(missingPointer =>
        missingPointer.km === km
          ? { ...missingPointer, position: newPosition }
          : missingPointer
      )
    )
  }

  function handleNextStep() {
    setKeyPointers(pointersToWork as [])

    const newSteps = steps
      .map(step =>
        step.text.startsWith('1.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('2.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('3.') ? { ...step, state: 'running' } : step
      )

    setSteps(newSteps as [])
  }

  const missingPositionSteps = pointersToWork.filter(
    missingPointer => !missingPointer.position
  )
  const hasMissingPositionSteps = Boolean(missingPositionSteps.length)

  const cssPositionLinkError = 'text-rose-600 hover:bg-red-100'

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-[1fr,auto] py-5 px-8">
        <div className="flex-col">
          <Title>
            Foram encontrados {pointersToWork.length} pontos chaves de um todo
            de {pointers.length} pontos mapeados
          </Title>
          <Description>
            Informe abaixo a localização dos pontos faltantes (
            {missingPositionSteps.length} pontos):
          </Description>
        </div>
        <div className="ml-auto">
          <ButtonStep
            disabled={hasMissingPositionSteps}
            onClick={() => handleNextStep()}
            className="my-1 mx-0 w-fit active:bg-gray-200 disabled:bg-gray-400"
          >
            Próxima Etapa
          </ButtonStep>
        </div>
      </div>
      <div className="flex h-full flex-col px-10">
        <div className="my-1 grid w-8/12 grid-cols-[1fr,1fr,5fr,1fr,6fr,1fr] bg-white font-medium text-gray-600">
          <span>Index</span>
          <span />
          <span>Quilometragem</span>
          <span />
          <span>
            Posição <span className="text-sm font-normal">[Editável]</span>
          </span>
          <span />
        </div>
        <ul className="relative flex max-h-[45vh] w-8/12 flex-col overflow-y-auto">
          {pointersToWork.map((missingPointer, indexMissingPointer) => (
            <li
              className="my-1 ml-1 grid grid-cols-[1fr,1fr,5fr,1fr,6fr,1fr] text-gray-600"
              key={missingPointer.km}
            >
              <span>#{indexMissingPointer}</span>
              <span>-</span>
              <span>
                Marcação km {missingPointer.km}{' '}
                <span className="text-sm font-normal text-blue-800">
                  ({missingPointer.kmDistance?.toLocaleString()})
                </span>
              </span>
              <span>-</span>
              <a
                className={[
                  'cursor-pointer text-indigo-700 hover:bg-blue-100',
                  missingPointer.position ? '' : cssPositionLinkError
                ].join(' ')}
                onClick={() =>
                  handleOnClickEditMarkerPosition(
                    indexMissingPointer,
                    missingPointer
                  )
                }
              >
                {(missingPointer.position ?? ['?', '?']).join(',')}
              </a>
              <span>-</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
