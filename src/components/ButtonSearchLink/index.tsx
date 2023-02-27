import { AnchorHTMLAttributes } from 'react'

type ButtonSearchLinkProps = {
  selected?: boolean
} & AnchorHTMLAttributes<HTMLAnchorElement>

export default function Root({
  children,
  selected,
  ...props
}: ButtonSearchLinkProps) {
  const styleClass =
    selected === true
      ? 'flex cursor-not-allowed items-center px-3 py-2 text-lg font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform bg-gray-100 border border-bg-200 rounded-md'
      : 'flex focus:ring-2 focus:ring-red-600 focus:ring-offset-1 items-center px-3 py-2 text-lg font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-500 rounded-md hover:bg-red-600 focus:bg-red-600 focus:outline-none sm:mx-2'

  return (
    <a {...props} className={styleClass}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="mx-1 h-6 w-6"
      >
        <path
          fillRule="evenodd"
          d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </a>
  )
}
