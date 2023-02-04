import { HtmlHTMLAttributes } from 'react'

type RootProps = HtmlHTMLAttributes<HTMLElement> & {
  show?: boolean
}

export function Root ({
  show,
  ...props
}: RootProps) {
  return (
    <>{show === true && props.children}</>
  )
}

export function Mask () {
  return (
    <div className="fixed left-0 top-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] z-30 show-mask" style={{ backdropFilter: 'blur(3px) ' }}/>
  )
}

export function ModalContainer (props: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="fixed justify-self-center self-center px-8 py-6 bg-white rounded-xl z-30 text-gray-700 show-modal shadow-md max-h-[95vh] overflow-y-auto" {...props}>
      {props.children}
    </div>
  )
}

export function Title (props: HtmlHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className='text-4xl text-gray-700 font-medium' {...props}>
      {props.children}
    </h1>
  )
}

export function ContainerField (props: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="py-1 px-2 flex flex-col" {...props}>
      {props.children}
    </div>
  )
}
