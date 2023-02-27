import { HTMLAttributes } from 'react'

export default function Title(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className="text-xl font-medium text-gray-600" {...props}>
      {props.children}
    </h3>
  )
}
