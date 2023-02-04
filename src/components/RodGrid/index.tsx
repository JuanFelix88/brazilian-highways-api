import { ImgHTMLAttributes, HTMLAttributes, AnchorHTMLAttributes } from 'react'

type RootProps = HTMLAttributes<HTMLDivElement>

export function Root (props: RootProps) {
  return (
    <div className="flex w-full py-3 px-0 text-gray-800 justify-start flex-wrap rod-grid" {...props}>
      {/* <div className='flex flex-wrap flex-grow-0 flex-'> */}
        {props.children}
      {/* </div> */}
    </div>
  )
}

type CardContainerProps = AnchorHTMLAttributes<HTMLAnchorElement>

export function CardContainer (props: CardContainerProps) {
  return (
    <a className="flex relative mx-2 my-1 p-2 flex-col rounded-md items-center hover-show-icon-link hover:bg-red-50 h-80 card-rod" {...props}>
      {props.children}
    </a>
  )
}

type CardImageProps = ImgHTMLAttributes<HTMLImageElement>

export function CardImage (props: CardImageProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-red-800 to-red-300">
      <img className="w-full transform-on-hover" {...props} src={props.src} />
    </div>
  )
}

type CardTitleProps = ImgHTMLAttributes<HTMLImageElement>

export function CardTitle (props: CardTitleProps) {
  return (
    <h1 className='text-2xl font-bold p-3 text-gray-700 mx-4' {...props}>
      {props.children}
    </h1>
  )
}

type CardDescriptionProps = ImgHTMLAttributes<HTMLImageElement>

export function CardDescription (props: CardDescriptionProps) {
  return (
    <p className='text-gray-600 text-center px-3' style={{ maxWidth: '300px' }} {...props}>
      {props.children}
    </p>
  )
}

export function LinkIcon (props: any) {
  return (
    <div className="absolute transition-opacity w-full px-6 py-1 show-icon text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </div>
  )
}
