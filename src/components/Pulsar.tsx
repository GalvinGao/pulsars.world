// Pulsar.tsx
import { extend, useFrame } from '@react-three/fiber'
import { FC, useEffect, useMemo, useRef } from 'react'
import { ShaderMaterial } from 'three'

extend({ ShaderMaterial })

const pulsarMaterialShader = {
	vertexShader: `
    varying vec3 vUv;
    void main() {
      vUv = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    uniform float time;
    uniform float pulsePeriod;
    uniform float intensity;
    varying vec3 vUv;

    void main() {
      float distance = length(vUv);
      float pulse = sin(time * 2.0 * 3.14159265 / pulsePeriod);
      float pulseValue = step(0.9, pulse);
      gl_FragColor = vec4(vec3(intensity * pulseValue), 1.0);
    }
  `
}

interface PulsarProperties {
	position: [number, number, number]
	scale: number
	pulsePeriod: number
	intensity: number
}

export const Pulsar: FC<PulsarProperties> = ({
	position,
	scale,
	pulsePeriod,
	intensity
}) => {
	const material = useRef<ShaderMaterial>(null)
	const mesh = useRef<THREE.Mesh>(null)

	useEffect(() => {
		material.current.uniforms.pulsePeriod.value = pulsePeriod
		material.current.uniforms.intensity.value = intensity
	}, [pulsePeriod, intensity])

	useFrame(({ clock }) => {
		material.current.uniforms.time.value = clock.getElapsedTime()
	})

	const shaderMaterialProperties = useMemo(() => {
		return {
			...pulsarMaterialShader,
			uniforms: {
				time: { value: 0 },
				pulsePeriod: { value: pulsePeriod },
				intensity: { value: intensity }
			}
		}
	}, [pulsePeriod, intensity])

	return (
		<mesh ref={mesh} position={position} scale={[scale, scale, scale]}>
			<sphereBufferGeometry args={[1, 32, 32]} />
			<shaderMaterial
				ref={material}
				attach='material'
				{...shaderMaterialProperties}
			/>
		</mesh>
	)
}

export default Pulsar
