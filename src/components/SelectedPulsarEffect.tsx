import type { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useAtomValue } from 'jotai'
import { objectScaleAtom, selectedPulsarIdAtom } from 'models/atoms'
import { pulsarsById } from 'models/pulsars'
import { useEffect, useMemo } from 'react'
import { transformPosition } from 'utils'

export function SelectedPulsarEffect() {
	const selectedPulsarId = useAtomValue(selectedPulsarIdAtom)
	const objectScale = useAtomValue(objectScaleAtom)
	const controls = useThree(
		state => state.controls
	) as unknown as CameraControls

	const selectedPulsar = useMemo(() => {
		if (!selectedPulsarId) return null

		return pulsarsById.get(selectedPulsarId)
	}, [selectedPulsarId])

	useEffect(() => {
		if (!selectedPulsar) return

		const position = transformPosition(selectedPulsar.position)

		console.log('current:', {
			rotation: controls.azimuthAngle,
			polar: controls.polarAngle
		})

		console.log('moving', selectedPulsar, 'to:', {
			x: position.x,
			y: position.y,
			z: position.z
		})

		controls.moveTo(position.x, position.y, position.z, true)
		controls.dollyTo(10, true)
		controls.rotateTo(0, Math.PI / 2, true)

		window.controls = controls
	}, [selectedPulsar, controls, objectScale])

	return null
}
