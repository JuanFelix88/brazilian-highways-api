import { Pointer } from '@/src/application/entities/pointer'
import { useMapping } from '@/src/contexts/Proteus/Mapping'
import { ConvertUf } from '@/src/mapping/convertUf'
import { useState } from 'react'
import ButtonStep from '../ButtonStep'
import Description from '../Description'
import Title from '../Title'

type CustomPointerToWork = Pointer & {
  requireConfirmation?: boolean
  confirmation?: boolean
  changedKilometerMarker?: boolean
  collateralChanged?: boolean
}

function getAccuracy(marker: number, distance: number): number {
  if (marker === 0 || distance === 0) {
    return 0
  } else if (marker > distance) {
    return marker % distance
  } else {
    return distance % marker
  }
}

const ACCEPTABLE_ACCURACY_METERS = 0.15
const DEFAULT_ACCURACY = 0.05

export default function VerifyLowPrecisionPointers() {
  const { keyPointers, setKeyPointers, setSteps, steps } = useMapping()
  const [pointersToWorkList, setPointersToWorkList] = useState<
    CustomPointerToWork[]
  >(
    keyPointers.map(keyPointer =>
      keyPointer.city && keyPointer.uf
        ? { ...keyPointer, uf: ConvertUf.encode(keyPointer.uf) }
        : keyPointer
    )
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
      pointersToWorkList.map(pointer =>
        pointer.km === km
          ? {
              ...pointer,
              position: newPosition,
              kmDistance: pointer.km + DEFAULT_ACCURACY
            }
          : pointer
      )
    )
  }

  function handleNextStep() {
    setKeyPointers(pointersToWorkList as [])

    const newSteps = steps.map(step => ({ ...step, state: 'concluded' }))

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

  function handleChangeCityUf(
    index: number,
    { city, uf }: CustomPointerToWork
  ) {
    const defaultValue = `${city ?? 'Cidade'}-${uf ?? 'UF'}`
    const val = prompt('Informe um novo valor para Cidade-UF:', defaultValue)
    if (val === null) {
      return
    }
    if (!/^.*-[A-Z]{2}$/.test(val)) {
      return alert('O valor informado não está no padrão esperado de Cidade-UF')
    }

    const [, newCity, newUf] = val.match(/^(.*)-([A-Z]{2})$/)!

    setPointersToWorkList(
      pointersToWorkList.map((pointerToWork, pointerToWorkIndex) =>
        pointerToWorkIndex === index
          ? { ...pointerToWork, city: newCity, uf: newUf }
          : pointerToWork
      )
    )
  }

  function handleRemoveMarker(index: number) {
    const newPointersToWorkList = pointersToWorkList.filter(
      (_, pointerToWorkIndex) => pointerToWorkIndex !== index
    )
    setPointersToWorkList(newPointersToWorkList)
  }

  function handleAddMaker() {
    const { km = 0 } = pointersToWorkList.at(-1) ?? {}

    const newPointerToWork = {
      km: km + 1,
      kmDistance: km + 1,
      majority: true
    } as CustomPointerToWork

    setPointersToWorkList([...pointersToWorkList, newPointerToWork])
  }

  const pointersWithLowAccuracy = pointersToWorkList.filter(
    ({ km, kmDistance }) =>
      getAccuracy(km, kmDistance) > ACCEPTABLE_ACCURACY_METERS
  )
  const hasPendantPointers =
    Boolean(pointersWithLowAccuracy.length) ||
    pointersToWorkList.some(
      ({ position, city, uf }) => !position || !city || !uf
    )

  const cssLowAccuracy = 'text-rose-600'
  const cssMissing = 'text-rose-600 hover:bg-red-100'
  const cssPointerChangedKilometerMarker = 'text-amber-500 hover:bg-amber-100'
  const cssCollateralChanged = 'text-yellow-700 hover:bg-amber-100'

  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-[1fr,auto] py-5 px-8">
        <div className="flex-col">
          <Title>
            Há {pointersWithLowAccuracy.length} pontos com baixa precisão{' '}
            {`(> 150m)`}
          </Title>
          <Description>
            Altere as posições para uma posição mais aproximada:
          </Description>
        </div>
        <div className="ml-auto">
          <ButtonStep
            disabled={hasPendantPointers}
            onClick={handleNextStep}
            className="my-1 mx-0 w-fit bg-sky-500 hover:bg-sky-400 active:bg-sky-300 disabled:bg-sky-300"
          >
            Concluir verificações
          </ButtonStep>
        </div>
      </div>
      <div className="flex h-full flex-col px-10">
        <li className="my-1 grid w-full grid-cols-[1fr,0.3fr,2fr,0.3fr,5fr,0.3fr,4.5fr,0.3fr,4fr,0.3fr,3fr] pr-5 font-medium text-gray-600">
          <span>Index</span>
          <span />
          <span>Quilometragem</span>
          <span />
          <span>
            Cidade-UF <span className="text-sm font-normal">[editável]</span>
          </span>
          <span />
          <span>
            Posição <span className="text-sm font-normal">[editável]</span>
          </span>
          <span />
          <span>Precisão</span>
          <span />
          <span>
            Controle <span className="text-sm font-normal">[editável]</span>
          </span>
        </li>
        <ul className="flex max-h-[45vh] w-full flex-col overflow-y-auto">
          {pointersToWorkList.map((pointerToWork, pointerToWorkIndex) => (
            <li
              className="my-1 ml-1 grid grid-cols-[1fr,0.3fr,2fr,0.3fr,5fr,0.3fr,4.5fr,0.3fr,4fr,0.3fr,3fr] text-gray-600"
              key={`${pointerToWorkIndex}${
                pointerToWork.km
              }${pointerToWork.position?.join('.')}`}
            >
              <span>#{pointerToWorkIndex}</span>
              <span>-</span>
              <a
                className={`cursor-pointer text-indigo-700 hover:bg-blue-100 ${
                  pointerToWork.collateralChanged ? cssCollateralChanged : ''
                } ${
                  pointerToWork.changedKilometerMarker
                    ? cssPointerChangedKilometerMarker
                    : ''
                }`}
                onClick={() =>
                  handleChangeKilometerMarker(pointerToWorkIndex, pointerToWork)
                }
              >
                Km {pointerToWork.km}{' '}
              </a>
              <span>-</span>
              <a
                className={[
                  'cursor-pointer text-indigo-700 hover:bg-blue-100',
                  pointerToWork.city ?? pointerToWork.uf ? '' : cssMissing
                ].join(' ')}
                onClick={() =>
                  handleChangeCityUf(pointerToWorkIndex, pointerToWork)
                }
              >
                {pointerToWork.city}-{pointerToWork.uf}
              </a>
              <span>-</span>
              <a
                className={[
                  'cursor-pointer text-indigo-700 hover:bg-blue-100',
                  pointerToWork.position ? '' : cssMissing
                ].join(' ')}
                onClick={() =>
                  handleChangePosition(pointerToWorkIndex, pointerToWork)
                }
              >
                {(pointerToWork.position ?? ['?', '?']).join(',')}
              </a>
              <span>-</span>
              <span
                className={[
                  getAccuracy(pointerToWork.km, pointerToWork.kmDistance) >
                  ACCEPTABLE_ACCURACY_METERS
                    ? cssLowAccuracy
                    : ''
                ].join(' ')}
              >
                {(
                  getAccuracy(pointerToWork.km, pointerToWork.kmDistance) * 1000
                ).toLocaleString()}{' '}
                metros
              </span>
              <span>-</span>
              <a
                onClick={() => handleRemoveMarker(pointerToWorkIndex)}
                className="cursor-pointer text-rose-700 hover:bg-rose-100"
              >
                [Remover]
              </a>
            </li>
          ))}
          <a
            href="#insert-row"
            onClick={handleAddMaker}
            className="my-1 ml-1 grid cursor-pointer grid-cols-[1fr,0.3fr,2fr,0.3fr,5fr,0.3fr,4.5fr,0.3fr,4fr,0.3fr,3fr] text-sky-700  hover:bg-sky-100"
          >
            <span>[+]</span>
            <span />
            <span />
            <span />
            <span>Clique aqui para adicionar</span>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span>[Adicionar]</span>
          </a>
        </ul>
      </div>
    </div>
  )
}
