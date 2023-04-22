import { Text, shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { TransformedPulsar } from 'models/pulsars'
import * as THREE from 'three'

const o = new THREE.Object3D()

const scaleFactor = 2e2

const MeshGlowingMaterial = shaderMaterial(
	{ glowFalloff: 2 },
	`varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }`,
	`varying vec3 vNormal;
  uniform float glowFalloff;
  void main() {
    vec3 light = vec3(0, 1, 0);
    float intensity = pow(dot(vNormal, light), glowFalloff);
    // vec3 baseColor = vec3(0.0, 1.0, 0.0);
    // vec3 glowColor = vec3(1.0, 0.0, 0.0);
		vec3 baseColor = vec3(1.0, 1.0, 1.0);
    vec3 glowColor = vec3(1.0, 1.0, 1.0);
    vec3 finalColor = mix(baseColor, glowColor, intensity);
    gl_FragColor = vec4(finalColor, 1.0);
  }`
)

extend({ MeshGlowingMaterial })

export function Pulsars({ pulsars }: { pulsars: TransformedPulsar[] }) {
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
			{pulsars.map((pulsar, index) => (
				<mesh
					key={pulsar.id}
					position={[
						pulsar.position!.x * scaleFactor,
						pulsar.position!.y * scaleFactor,
						pulsar.position!.z * scaleFactor
					]}
				>
					<sphereGeometry args={[0.25]} />
					<meshGlowingMaterial />
					<Text position={[0, 0.8, 0]} scale={[0.4, 0.4, 0.4]}>
						{pulsar.name}, {(pulsar.distanceKpc ?? 0) * 1000}pc
					</Text>
				</mesh>
			))}
		</group>
	)
}
