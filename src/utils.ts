import { useLayoutEffect, useState } from 'react'

// eslint-disable-next-line import/prefer-default-export
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(() => matchMedia(query).matches)

	useLayoutEffect(() => {
		const mediaQuery = matchMedia(query)

		function onMediaQueryChange(): void {
			setMatches(mediaQuery.matches)
		}

		mediaQuery.addEventListener('change', onMediaQueryChange)

		return (): void => {
			mediaQuery.removeEventListener('change', onMediaQueryChange)
		}
	}, [query])

	return matches
}

export function transformPosition(
	position: { x: number; y: number; z: number },
	scaleFactor = 2e2
): { x: number; y: number; z: number } {
	return {
		x: position.x * scaleFactor,
		y: position.y * scaleFactor,
		z: position.z * scaleFactor
	}
}
