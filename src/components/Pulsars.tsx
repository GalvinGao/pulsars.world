import PulsarObject from 'components/Pulsar'
import { useAtomValue } from 'jotai'
import { objectScaleAtom, timeScaleAtom } from 'models/atoms'
import { Pulsar } from 'models/pulsars'
import { transformPosition } from 'utils'

export function Pulsars({ pulsars }: { pulsars: Pulsar[] }) {
	const timeScale = useAtomValue(timeScaleAtom)
	const objectScale = useAtomValue(objectScaleAtom)
	// const reference = useRef<InstancedMesh | null | undefined>(undefined)
	// useLayoutEffect(() => {
	// 	if (!reference.current) return

	// 	let index = 0
	// 	for (const pulsar of pulsars) {
	// 		// o.rotation.set(Math.random(), Math.random(), Math.random())
	// 		if (!pulsar.position) return
	// 		const id = index++
	// 		o.position.set(
	// 			pulsar.position.x * scaleFactor,
	// 			pulsar.position.y * scaleFactor,
	// 			pulsar.position.z * scaleFactor
	// 		)
	// 		o.updateMatrix()
	// 		reference.current.setMatrixAt(id, o.matrix)
	// 	}
	// 	reference.current.instanceMatrix.needsUpdate = true
	// }, [pulsars])

	return (
		// <group>
		// 	<instancedMesh ref={reference} args={[null, null, pulsars.length]}>
		// 		<sphereGeometry args={[0.25]} />
		// 		<meshGlowingMaterial />
		// 	</instancedMesh>
		// </group>
		<group>
			{pulsars.map(pulsar => {
				// <mesh
				// 	key={pulsar.id}
				// 	position={[
				// 		pulsar.position!.x * scaleFactor,
				// 		pulsar.position!.y * scaleFactor,
				// 		pulsar.position!.z * scaleFactor
				// 	]}
				// >
				// 	<sphereGeometry args={[0.25]} />
				// 	<meshGlowingMaterial />
				// 	<Text position={[0, 0.8, 0]} scale={[0.4, 0.4, 0.4]}>
				// 		{pulsar.name}, {(pulsar.distanceKpc ?? 0) * 1000}pc
				// 	</Text>
				// </mesh>

				const position = transformPosition(pulsar.position)

				return (
					<PulsarObject
						id={pulsar.identifier}
						position={[position.x, position.y, position.z]}
						scale={objectScale}
						pulsePeriod={pulsar.periodS * (1 / timeScale)}
						pulseDuration={Math.max(
							pulsar.periodS * (1 / timeScale) * 1e-2,
							1 / 100
						)}
						intensity={1}
						key={pulsar.identifier + '_' + timeScale}
					/>
				)
			})}
		</group>
	)
}
