import { Pointer } from './pointer'

export namespace PluginMessageProtocol {
  export type Types =
    | 'set-pointers'
    | 'set-mapped-pointers'
    | 'set-key-pointers'
    | 'concluded+'
    | 'plugin-listening+'
    | 'app-listening+'

  export namespace DataTransfer {
    export interface SetPointers {
      pointers: Array<Partial<Pointer>>
    }

    export interface SetMappedPointers {
      pointers: Pointer[]
    }

    export interface SetKeyPointers {
      pointers: Pointer[]
    }

    export interface Concluded {
      highwayDistance: number
      totalTime: number
    }

    export type Listening = null
  }
}

export interface PluginMessageProtocol {
  type: PluginMessageProtocol.Types
  data:
    | PluginMessageProtocol.DataTransfer.SetPointers
    | PluginMessageProtocol.DataTransfer.SetMappedPointers
    | PluginMessageProtocol.DataTransfer.SetKeyPointers
    | PluginMessageProtocol.DataTransfer.Concluded
    | PluginMessageProtocol.DataTransfer.Listening
}
