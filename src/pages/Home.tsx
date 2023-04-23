import { CameraControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { DevelopmentUtils } from 'components/DevelopmentUtils'
import Head from 'components/Head'
import { Pulsars } from 'components/Pulsars'
import { TimeScaleSlider } from 'components/TimeScaleSlider'
import { pulsars } from 'models/pulsars'
import { ReactElement } from 'react'

export default function HomePage(): ReactElement {
	return (
		<div className='h-full w-full'>
			<Head title='Map' />
			<Canvas camera={{ position: [0, 0, 10], far: 15_000 }}>
				<ambientLight intensity={0.2} />
				<directionalLight position={[15, 15, 15]} intensity={1} />
				<Pulsars pulsars={pulsars} />
				<mesh>
					<sphereGeometry args={[0.1]} />
					<meshStandardMaterial color='red' emissiveIntensity={0.2} />
				</mesh>
				<PerspectiveCamera makeDefault position={[0, 0, 10]} />
				<CameraControls makeDefault minDistance={0} maxDistance={3000} />
				{/* <TrackballControls
					noRotate
					zoomSpeed={0.5}
					minDistance={0}
					maxDistance={3000}
				/>
				<OrbitControls enableZoom={false} /> */}
				<EffectComposer>
					<Bloom
						luminanceThreshold={0.1}
						luminanceSmoothing={0.9}
						intensity={2}
					/>
				</EffectComposer>
				{import.meta.env.DEV && <DevelopmentUtils />}
			</Canvas>

			<div className='absolute bottom-0 left-0 right-0 flex items-center bg-slate-900 p-4'>
				<TimeScaleSlider />
			</div>
		</div>
	)
}
