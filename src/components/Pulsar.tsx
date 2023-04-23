// Pulsar.tsx
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
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
    uniform float maxIntensity;
    uniform float minIntensity;
    uniform float pulseDuration;
    uniform float glowRadius;
    uniform float glowFalloff;
    varying vec3 vUv;

    void main() {
      float distance = length(vUv);
      float pulse = mod(time, pulsePeriod);
      float pulseValue = 1.0 - smoothstep(0.0, pulseDuration, pulse);
      
      // Calculate the intensity without the glow effect
      float baseIntensity = mix(minIntensity, maxIntensity, pulseValue);
      
      // Calculate glow effect based on the distance and falloff
      float glow = smoothstep(glowRadius, glowRadius - glowFalloff, distance);
      
      // Combine the intensity and glow for the final output color
      float intensity = baseIntensity + (maxIntensity - baseIntensity) * glow;
      float alpha = mix(minIntensity, 1.0, intensity);
      gl_FragColor = vec4(vec3(intensity), alpha);
    }
  `
}

interface PulsarProperties {
	position: [number, number, number]
	scale: number
	pulsePeriod: number
	pulseDuration: number
	intensity: number
}

export function Pulsar({
	position,
	scale,
	pulsePeriod,
	pulseDuration,
	intensity
}: PulsarProperties) {
	const material = useRef<ShaderMaterial>(null)
	const mesh = useRef<THREE.Mesh>(null)

	// useEffect(() => {
	// 	if (!material.current || !mesh.current) return

	// 	material.current.uniforms.pulsePeriod.value = pulsePeriod
	// 	material.current.uniforms.intensity.value = intensity
	// }, [pulsePeriod, intensity])
	const controls = useThree(state => state.controls) as any

	useFrame(({ clock }) => {
		if (!material.current) return

		material.current.uniforms.time.value = clock.getElapsedTime()
	})

	const shaderMaterialProperties = useMemo(() => {
		return {
			...pulsarMaterialShader,
			uniforms: {
				time: { value: 0 },
				pulsePeriod: { value: pulsePeriod },
				pulseDuration: { value: pulseDuration },
				minIntensity: { value: 0.03 },
				maxIntensity: { value: 1 },
				glowRadius: { value: 0.5 },
				glowFalloff: { value: 0.5 }
			}
		}
	}, [pulsePeriod, pulseDuration])

	return (
		<mesh
			ref={mesh}
			position={position}
			scale={[scale, scale, scale]}
			onClick={() => {
				console.log('clicked', {
					position,
					scale,
					pulsePeriod,
					pulseDuration,
					intensity
				})

				// controls.panCamera({
				// 	x: position[0],
				// 	y: position[1],
				// 	z: position[2] + 5
				// })
				// controls.zoomCamera(1.1)
				// controls.rotateCamera(0, 0.1)

				// controls.update()

				// but controls is a CameraControls object

				console.log(controls)
				controls.moveTo(position[0], position[1], position[2] + 5, true)
				controls.zoomTo(1.1, true)
				controls.dollyTo(1.1, true)
			}}
		>
			<sphereGeometry args={[1, 8, 8]} />
			<shaderMaterial
				ref={material}
				attach='material'
				{...shaderMaterialProperties}
			/>
		</mesh>
	)
}

export default Pulsar
