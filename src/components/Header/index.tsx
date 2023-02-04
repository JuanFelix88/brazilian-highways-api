import type { HTMLAttributes } from 'react'
import ButtonSearchLink from '../ButtonSearchLink'

export function Root (props: HTMLAttributes<HTMLElement>) {
  return (
    <nav className="md:flex md:items-center md:justify-between py-2">
      <div className="flex items-center md:justify-between">
        <button className="md:hidden">
          <span>
            <svg
              className="w-6 h-6 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z" />
            </svg>
          </span>
        </button>
        <div>
          <a
            className="text-xl font-bold text-red-600 transition-colors duration-300 transform  hover:text-red-900 flex items-center"
            href="/"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            <div className='flex flex-col'>
              <i
                className="text-violet-700 my-0 leading-6"
              >
                proteus
              </i>
              <i className='my-0 leading-5'>rodovias.net</i>
            </div>
          </a>
        </div>
      </div>
      {props.children}
    </nav>
  )
}

export function NavLinksContainer (props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="absolute inset-x-0 z-20 w-full px-6 py-8 mt-8 space-y-6 transition-all duration-300 ease-in-out bg-white top-16 md:mt-0 md:p-0 md:top-0 md:relative md:w-auto md:opacity-100 md:translate-x-0 md:space-y-0 md:-mx-0 md:flex md:items-center">
      {props.children}
    </div>
  )
}

interface NavLinkProps {
  href?: string
  content: string
  selected?: boolean
}

export function NavLink ({ content, href, selected }: NavLinkProps) {
  const isSelected = selected === true
  const hrefLink = isSelected ? undefined : href
  const style = isSelected
    ? 'block text-red-700 transition-colors duration-300 mx-4'
    : 'block text-gray-600 transition-colors duration-300 hover:text-red-700 mx-4'

  return (
    <a href={hrefLink} className={style}>
      {content}
    </a>
  )
}

export { ButtonSearchLink }
