import { Pointer } from '@/src/application/entities/pointer'
import { useMapping } from '@/src/contexts/Proteus/Mapping'
import { useState } from 'react'
import ButtonStep from '../ButtonStep'
import Description from '../Description'
import Title from '../Title'

type CustomPointerToWork = Pointer & {
  id: number
  requireConfirmation?: boolean
  confirmation?: boolean
  changedKilometerMarker?: boolean
  collateralChanged?: boolean
}

const InlineSeparator = () => <span>-</span>
const InlineHeaderSeparator = () => <span />

const DEFAULT_ACCURACY = 0.05

export default function Verify50KilometersMarkersSection() {
  const { pointers, keyPointers, setKeyPointers, setSteps, steps } =
    useMapping()
  const [pointersToWorkList, setPointersToWorkList] = useState<
    CustomPointerToWork[]
  >(
    keyPointers
      .map(keyPointer =>
        keyPointer.km % 50 === 0
          ? ({
              ...keyPointer,
              requireConfirmation: true,
              confirmation: false
            } as CustomPointerToWork)
          : keyPointer
      )
      .map((keyPointer, index, arr) =>
        index + 1 === arr.length
          ? ({
              ...keyPointer,
              requireConfirmation: true,
              confirmation: false
            } as CustomPointerToWork)
          : keyPointer
      )
      .map(keyPointer => ({
        ...keyPointer,
        id: Number.parseInt((Math.random() * 1_000_000_000).toString(), 10)
      }))
  )

  function handleChangePosition(
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

    setPointersToWorkList(
      pointersToWorkList.map(pointerToWork =>
        pointerToWork.km === km
          ? {
              ...pointerToWork,
              position: newPosition,
              kmDistance: pointerToWork.km + DEFAULT_ACCURACY
            }
          : pointerToWork
      )
    )
  }

  function handleChangeConfirmationState(
    index: number,
    { km }: CustomPointerToWork
  ) {
    const val = confirm(
      `Deseja afirmar uma nova confirmação para o ponto #${index}?`
    )

    setPointersToWorkList(
      pointersToWorkList.map(pointerToWork =>
        pointerToWork.km === km
          ? ({ ...pointerToWork, confirmation: val } as CustomPointerToWork)
          : pointerToWork
      )
    )
  }

  function handleNextStep() {
    setKeyPointers(pointersToWorkList as [])

    const newSteps = steps
      .map(step =>
        step.text.startsWith('1.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('2.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('3.') ? { ...step, state: 'concluded' } : step
      )
      .map(step =>
        step.text.startsWith('4.') ? { ...step, state: 'running' } : step
      )

    setSteps(newSteps as [])
  }

  function handleChangeKilometerMarker(
    changedIndex: number,
    { km: oldKilometer }: CustomPointerToWork
  ) {
    const val = prompt(
      `Informe a nova marcação de km para a posição #${changedIndex}:`,
      String(oldKilometer)
    )

    if (val === null) {
      return
    }

    if (!/[0-9]{1,5}/.test(val)) {
      return alert(
        'Não foi possível alterar a marcação pois o valor não é um número inteiro válido.'
      )
    }

    const newKilometer = Number(val)

    setPointersToWorkList(
      pointersToWorkList
        .map((pointerToWork, pointerToWorkIndex) =>
          pointerToWorkIndex === changedIndex
            ? {
                ...pointerToWork,
                km: newKilometer,
                changedKilometerMarker: true,
                collateralChanged: false
              }
            : pointerToWork
        )
        .reduce<CustomPointerToWork[] & { foundedChangedMarker?: boolean }>(
          (
            pointersToWorkChangedMarkerList,
            pointerToWork,
            pointerToWorkIndex
          ) => {
            const { foundedChangedMarker: isFoundedOtherChangedMarker } =
              pointersToWorkChangedMarkerList

            if (isFoundedOtherChangedMarker) {
              pointersToWorkChangedMarkerList.push(pointerToWork)
              return pointersToWorkChangedMarkerList
            }

            if (pointerToWorkIndex <= changedIndex) {
              pointersToWorkChangedMarkerList.push(pointerToWork)
              return pointersToWorkChangedMarkerList
            }

            if (pointerToWork.changedKilometerMarker) {
              pointersToWorkChangedMarkerList.foundedChangedMarker = true
              pointersToWorkChangedMarkerList.push(pointerToWork)
              return pointersToWorkChangedMarkerList
            }

            if (pointerToWorkIndex > changedIndex) {
              pointersToWorkChangedMarkerList.push({
                ...pointerToWork,
                km: newKilometer + pointerToWorkIndex - changedIndex,
                collateralChanged: true
              })
            }

            return pointersToWorkChangedMarkerList
          },
          []
        )
    )
  }

  const missingConfirmationsPointers = pointersToWorkList.filter(
    pointer => pointer.requireConfirmation && !pointer.confirmation
  )
  const hasMissingConfirmations = Boolean(missingConfirmationsPointers.length)

  const cssMissingConfirmation = 'text-rose-600 hover:bg-rose-100'
  const cssPointerChangedKilometerMarker = 'text-amber-500 hover:bg-amber-100'
  const cssCollateralChanged = 'text-yellow-700 hover:bg-amber-100'

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-[1fr,auto] py-5 px-8">
        <div className="flex-col">
          <Title>
            Foram encontrados {pointersToWorkList.length} pontos chaves de um
            todo de {pointers.length} pontos mapeados.
          </Title>
          <Description>
            Confirme abaixo a posição dos pontos pendentes (
            {missingConfirmationsPointers.length} pontos):
          </Description>
        </div>
        <div className="ml-auto">
          <ButtonStep
            disabled={hasMissingConfirmations}
            onClick={() => handleNextStep()}
            className="my-1 mx-0 w-fit active:bg-gray-200 disabled:bg-gray-400"
          >
            Próxima Etapa
          </ButtonStep>
        </div>
      </div>
      <div className="flex h-full flex-col px-10">
        <li className="my-1 grid w-8/12 grid-cols-[1fr,1fr,5fr,0.5fr,5fr,0.5fr,4fr] pr-5 font-medium text-gray-600">
          <span>Index</span>
          <InlineHeaderSeparator />
          <span>
            Quilometragem{' '}
            <span className="text-sm font-normal">[editável]</span>
          </span>
          <InlineHeaderSeparator />
          <span>
            Posição <span className="text-sm font-normal">[editável]</span>
          </span>
          <InlineHeaderSeparator />
          <span>
            Confirmação <span className="text-sm font-normal">[editável]</span>
          </span>
        </li>
        <ul className="flex max-h-[45vh] w-8/12 flex-col overflow-y-auto">
          {pointersToWorkList.map((pointerToWork, pointerToWorkIndex) => (
            <li
              className="my-1 ml-1 grid grid-cols-[1fr,1fr,5fr,0.5fr,5fr,0.5fr,4fr] text-gray-600"
              key={pointerToWork.id}
            >
              <span>#{pointerToWorkIndex}</span>
              <InlineSeparator />
              <a
                onClick={() =>
                  handleChangeKilometerMarker(pointerToWorkIndex, pointerToWork)
                }
                className={`cursor-pointer text-indigo-700 hover:bg-blue-100 ${
                  pointerToWork.collateralChanged ? cssCollateralChanged : ''
                } ${
                  pointerToWork.changedKilometerMarker
                    ? cssPointerChangedKilometerMarker
                    : ''
                }`}
              >
                Marcação km {pointerToWork.km}{' '}
                <span className="text-sm font-normal">
                  ({pointerToWork.kmDistance?.toLocaleString()})
                </span>
              </a>
              <InlineSeparator />
              <a
                className="cursor-pointer text-indigo-700 hover:bg-blue-100"
                onClick={() =>
                  handleChangePosition(pointerToWorkIndex, pointerToWork)
                }
              >
                {(pointerToWork.position ?? ['?', '?']).join(',')}
              </a>
              <InlineSeparator />
              <a
                className={`cursor-pointer text-indigo-700 hover:bg-blue-100 ${
                  pointerToWork.requireConfirmation &&
                  !pointerToWork.confirmation
                    ? cssMissingConfirmation
                    : ''
                }`}
                onClick={() =>
                  handleChangeConfirmationState(
                    pointerToWorkIndex,
                    pointerToWork
                  )
                }
              >
                {pointerToWork.requireConfirmation &&
                  !pointerToWork.confirmation &&
                  '[Pendente]'}
                {pointerToWork.confirmation && '[Confirmado]'}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
