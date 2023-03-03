import { HtmlHTMLAttributes } from 'react'

type RootProps = HtmlHTMLAttributes<HTMLElement> & {
  show?: boolean
}

export function Root({ show, ...props }: RootProps) {
  return <>{show === true && props.children}</>
}

export function Mask() {
  return (
    <div
      className="show-mask fixed left-0 top-0 z-30 h-screen w-screen bg-[rgba(0,0,0,0.6)]"
      style={{ backdropFilter: 'blur(3px) ' }}
    />
  )
}

export function ModalContainer({
  className = '',
  ...props
}: HtmlHTMLAttributes<HTMLFormElement>) {
  return (
    <div className="fixed z-30 flex h-screen w-screen items-center justify-center">
      <form
        className={`show-modal scroll-modal max-h-[95%]  overflow-y-scroll rounded-lg bg-white px-8 py-6 text-gray-700 shadow-md ${className}`}
        {...props}
      >
        {props.children}
      </form>
    </div>
  )
}

export function Title(props: HtmlHTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className="mb-1 text-4xl font-medium text-gray-700" {...props}>
      {props.children}
    </h1>
  )
}

export function ContainerField(props: HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex flex-col py-1 px-2" {...props}>
      {props.children}
    </div>
  )
}
