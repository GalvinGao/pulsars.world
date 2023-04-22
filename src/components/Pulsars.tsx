import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { TransformedPulsar } from 'models/pulsars'
import niceColors from 'nice-color-palettes'
import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { InstancedMesh } from 'three'

const o = new THREE.Object3D()
const c = new THREE.Color()

const size = [0.1, 0.1, 0.1] as [number, number, number]

const MeshEdgesMaterial = shaderMaterial(
	{
		color: new THREE.Color('white'),
		size: new THREE.Vector3(1, 1, 1),
		thickness: 0.01,
		smoothness: 0.2
	},
	/*glsl*/ `varying vec3 vPosition;
  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * instanceMatrix * vec4(position, 1.0);
  }`,
	/*glsl*/ `varying vec3 vPosition;
  uniform vec3 size;
  uniform vec3 color;
  uniform float thickness;
  uniform float smoothness;
  void main() {
    vec3 d = abs(vPosition) - (size * 0.5);
    float a = smoothstep(thickness, thickness + smoothness, min(min(length(d.xy), length(d.yz)), length(d.xz)));
    gl_FragColor = vec4(color, 1.0 - a);
  }`
)
extend({ MeshEdgesMaterial })

export function Pulsars({ pulsars }: { pulsars: TransformedPulsar[] }) {
	const reference = useRef<InstancedMesh | null | undefined>(undefined)
	const outlines = useRef<InstancedMesh | null | undefined>(undefined)
	const colors = useMemo(
		() =>
			new Float32Array(
				Array.from({ length: pulsars.length }, () =>
					c.set(niceColors[17][Math.floor(Math.random() * 5)]).toArray()
				).flat()
			),
		[pulsars.length]
	)
	useLayoutEffect(() => {
		if (!reference.current || !outlines.current) return

		let index = 0
		for (const pulsar of pulsars) {
			// o.rotation.set(Math.random(), Math.random(), Math.random())
			if (!pulsar.position) return
			const id = index++
			o.position.set(pulsar.position.x, pulsar.position.y, pulsar.position.z)
			o.updateMatrix()
			reference.current.setMatrixAt(id, o.matrix)
		}
		reference.current.instanceMatrix.needsUpdate = true
		// Re-use geometry + instance matrix
		outlines.current.geometry = reference.current.geometry
		outlines.current.instanceMatrix = reference.current.instanceMatrix
	}, [pulsars])

	return (
		<group>
			<instancedMesh ref={reference} args={[null, null, pulsars.length]}>
				<boxGeometry args={size}>
					<instancedBufferAttribute
						attach='attributes-color'
						args={[colors, 3]}
					/>
				</boxGeometry>
				<meshLambertMaterial vertexColors toneMapped={false} />
			</instancedMesh>
			<instancedMesh ref={outlines} args={[null, null, pulsars.length]}>
				<meshEdgesMaterial
					transparent
					polygonOffset
					polygonOffsetFactor={-10}
					size={size}
					color='black'
					thickness={0.001}
					smoothness={0.005}
				/>
			</instancedMesh>
		</group>
	)
}
