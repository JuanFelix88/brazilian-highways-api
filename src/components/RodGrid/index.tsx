import { ImgHTMLAttributes, HTMLAttributes, AnchorHTMLAttributes } from 'react'

type RootProps = HTMLAttributes<HTMLDivElement>

export function Root(props: RootProps) {
  return (
    <div
      className="rod-grid flex w-full flex-wrap justify-start py-3 px-0 text-gray-800"
      {...props}
    >
      {/* <div className='flex flex-wrap flex-grow-0 flex-'> */}
      {props.children}
      {/* </div> */}
    </div>
  )
}

type CardContainerProps = AnchorHTMLAttributes<HTMLAnchorElement>

export function CardContainer(props: CardContainerProps) {
  return (
    <a
      className="hover-show-icon-link card-rod relative mx-2 my-1 flex h-80 flex-col items-center rounded-md p-2 hover:bg-red-50"
      {...props}
    >
      {props.children}
    </a>
  )
}

type CardImageProps = ImgHTMLAttributes<HTMLImageElement>

export function CardImage(props: CardImageProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-gradient-to-br from-red-800 to-red-300">
      <img className="transform-on-hover w-full" {...props} src={props.src} />
    </div>
  )
}

type CardTitleProps = ImgHTMLAttributes<HTMLImageElement>

export function CardTitle(props: CardTitleProps) {
  return (
    <h1 className="mx-4 p-3 text-2xl font-bold text-gray-700" {...props}>
      {props.children}
    </h1>
  )
}

type CardDescriptionProps = ImgHTMLAttributes<HTMLImageElement>

export function CardDescription(props: CardDescriptionProps) {
  return (
    <p
      className="px-3 text-center text-gray-600"
      style={{ maxWidth: '300px' }}
      {...props}
    >
      {props.children}
    </p>
  )
}

export function LinkIcon(props: any) {
  return (
    <div className="show-icon absolute w-full px-6 py-1 text-white transition-opacity">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </div>
  )
}
