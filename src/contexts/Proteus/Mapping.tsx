import { Pointer } from '@/src/application/entities/pointer'
import { StepProgressStates } from '@/src/components/StepProgress'
import { createContext, useContext, useState } from 'react'

interface MappingStep {
  text: string
  state: StepProgressStates
}

interface MappingContext {
  pointers: Array<Partial<Pointer>>
  setPointers: (list: Array<Partial<Pointer>>) => void

  highwayDistance: number | null
  setHighwayDistance: (n: number | null) => void

  totalTime: number | null
  setTotalTime: (n: number | null) => void

  steps: MappingStep[]
  setSteps: (steps: MappingStep[]) => void

  mappedPointers: Pointer[]
  setMappedPointers: (list: Pointer[]) => void

  pluginAlready: boolean
  setPluginAlready: (b: boolean) => void

  keyPointers: Pointer[]
  setKeyPointers: (l: Pointer[]) => void

  pluginWorkComplete: boolean
  setPluginWorkComplete: (b: boolean) => void
}

const MappingContext = createContext({} as MappingContext)

export function MappingProvider({ children }: any) {
  const [pointers, setPointers] = useState<Array<Partial<Pointer>>>([])
  const [mappedPointers, setMappedPointers] = useState<Pointer[]>([])
  const [keyPointers, setKeyPointers] = useState<Pointer[]>([])
  const [pluginAlready, setPluginAlready] = useState(false)
  const [highwayDistance, setHighwayDistance] = useState<number | null>(null)
  const [pluginWorkComplete, setPluginWorkComplete] = useState(false)
  const [totalTime, setTotalTime] = useState<number | null>(null)
  const [steps, setSteps] = useState<MappingStep[]>([
    {
      text: '1. Mapeamento dos pontos no Bing Plugin',
      state: 'running'
    },
    {
      text: '2. Verificar pontos faltantes',
      state: 'default'
    },
    {
      text: '3. Verificação de 50 a 50 km’s',
      state: 'default'
    },
    {
      text: '4. Verificação de pontos de baixa precisão e ajustes finais',
      state: 'default'
    }
  ])

  return (
    <MappingContext.Provider
      value={{
        pointers,
        setPointers,
        highwayDistance,
        setHighwayDistance,
        totalTime,
        setTotalTime,
        steps,
        setSteps,
        mappedPointers,
        setMappedPointers,
        pluginAlready,
        setPluginAlready,
        keyPointers,
        setKeyPointers,
        pluginWorkComplete,
        setPluginWorkComplete
      }}
    >
      {children}
    </MappingContext.Provider>
  )
}

export function useMapping() {
  return useContext(MappingContext)
}
