import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { DevelopmentUtils } from 'components/DevelopmentUtils'
import Head from 'components/Head'
import { Pulsars } from 'components/Pulsars'
import { TransformedPulsar, getPulsars } from 'models/pulsars'
import { ReactElement, useLayoutEffect, useState } from 'react'

function PulsarLoader(): ReactElement {
	const [pulsars, setPulsars] = useState<TransformedPulsar[]>([])

	useLayoutEffect(() => {
		getPulsars()
			.then(gotPulsars => gotPulsars.filter(pulsar => pulsar.position))
			.then(setPulsars)
	}, [])

	if (pulsars.length === 0) {
		return <> </>
	}

	return <Pulsars pulsars={pulsars} />
}

export default function HomePage(): ReactElement {
	// const cameraControlRef = useRef<CameraControls | null>(null)

	// useFrame(() => {
	// 	if (!cameraControlRef.current) return

	// 	cameraControlRef.current.
	// })

	return (
		<>
			<Head title='Map' />
			<Canvas camera={{ position: [0, 0, 10], far: 10_000 }}>
				<ambientLight intensity={0.85} />
				<directionalLight position={[150, 150, 150]} intensity={1} />
				{/* <mesh>
					<sphereGeometry />
					<meshStandardMaterial color='hotpink' />
				</mesh> */}
				<PulsarLoader />
				<mesh>
					<sphereGeometry args={[0.1]} />
					<meshStandardMaterial color='red' emissiveIntensity={0.2} />
				</mesh>
				<PerspectiveCamera makeDefault position={[0, 0, 10]} />
				<OrbitControls minDistance={3} maxDistance={1e3} />
				<EffectComposer>
					<Bloom
						luminanceThreshold={0.1}
						luminanceSmoothing={0.9}
						intensity={1.5}
					/>
				</EffectComposer>
				{import.meta.env.DEV && <DevelopmentUtils />}
			</Canvas>
		</>
	)
}
