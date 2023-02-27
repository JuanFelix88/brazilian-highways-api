import { ButtonHTMLAttributes } from 'react'

export default function ButtonStep(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const css =
    'flex bg-gray-500 focus:ring-2 focus:ring-offset-1 items-center px-4 py-3 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-md focus:outline-none hover:bg-gray-400 '

  return (
    <button {...props} className={css + props.className!}>
      {props.children}
    </button>
  )
}
