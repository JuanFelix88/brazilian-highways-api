import React, {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  InputHTMLAttributes,
  useRef
} from 'react'

type RootProps = {
  onSubmitForm?: (value: string) => void
} & FormHTMLAttributes<HTMLFormElement>

export function Root({ onSubmitForm, ...props }: RootProps) {
  function handleOnSubmitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    props.onSubmit?.(event)
  }
  return (
    <form
      {...props}
      onSubmit={props.onSubmit ?? handleOnSubmitForm}
      className="my-1 flex h-12 flex-col space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0"
    >
      {props.children}
    </form>
  )
}

export type InputProps = {
  onChangeInput?: (value: string) => void
  inputSearchRef?: React.MutableRefObject<HTMLInputElement | undefined>
} & InputHTMLAttributes<HTMLInputElement>

export function Input({
  inputSearchRef,
  onChangeInput = () => undefined,
  ...props
}: InputProps) {
  return (
    <input
      ref={inputSearchRef as React.LegacyRef<HTMLInputElement>}
      onChange={e => onChangeInput(e.target.value)}
      type="text"
      autoFocus
      className="w-96 rounded-md border bg-white px-2 py-3 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:mx-2"
      placeholder="Pesquise aqui.."
      {...props}
    />
  )
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      {...{
        className: `flex focus:ring-2 focus:ring-offset-1 items-center px-4 py-3 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-md focus:outline-none sm:mx-2 ${
          props.className ?? ''
        }`
      }}
    >
      {props.children}
    </button>
  )
}
