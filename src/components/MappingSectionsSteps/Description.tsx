import { HTMLAttributes } from 'react'

export default function Description(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <p className="text-lg font-normal text-gray-600" {...props}>
      {props.children}
    </p>
  )
}
