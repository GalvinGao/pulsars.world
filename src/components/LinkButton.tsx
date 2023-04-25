import clsx from 'clsx'
import { HTMLAttributes } from 'react'

export interface LinkButtonProps extends HTMLAttributes<HTMLAnchorElement> {
	href: string
}

export function LinkButton({ href, children, ...props }: LinkButtonProps) {
	return (
		<a
			href={href}
			target='_blank'
			rel='noreferrer'
			className={clsx(
				'flex items-center gap-2 rounded-md bg-purple-500 px-3 py-2 text-gray-100 transition hover:bg-purple-600 active:bg-purple-700',
				props.className
			)}
			{...props}
		>
			{children}
		</a>
	)
}
