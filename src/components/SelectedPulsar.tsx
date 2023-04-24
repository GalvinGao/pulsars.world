import { CloseButton } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { selectedPulsarIdAtom } from 'models/atoms'
import { pulsars } from 'models/pulsars'
import { ReactNode, useMemo } from 'react'

export interface FactListProps {
	facts: {
		label: string
		children: ReactNode
	}[]
}

export function FactList({ facts }: FactListProps) {
	return (
		<>
			{facts.map(({ label, children }) => (
				<div className='flex justify-between gap-4' key={label}>
					<div className='text-gray-400'>{label}</div>
					<div className='text-gray-100'>{children}</div>
				</div>
			))}
		</>
	)
}

export interface SelectedPulsarProps {
	_?: string
}

export function SelectedPulsar({ _ }: SelectedPulsarProps) {
	const [selectedPulsarId, setSelectedPulsarId] = useAtom(selectedPulsarIdAtom)

	const selectedPulsar = useMemo(() => {
		if (!selectedPulsarId) return null
		return pulsars.find(p => p.identifier === selectedPulsarId)
	}, [selectedPulsarId])

	const inner = () => {
		if (!selectedPulsar) return null

		return (
			<div className='flex flex-col gap-2 rounded-lg bg-gray-800 p-4'>
				<div className='flex justify-between'>
					<div className='text-lg font-bold text-gray-100'>
						{selectedPulsar.identifier}
					</div>
					<div className='-mx-2 -my-1 flex justify-end'>
						<CloseButton onClick={() => setSelectedPulsarId(null)} />
					</div>
				</div>
				<FactList
					facts={[
						{
							label: 'Distance',
							children: `${selectedPulsar.distanceKpc} Kpc`
						},
						{
							label: 'Period',
							children: `${selectedPulsar.periodS.toPrecision(10)} secs`
						}
					]}
				/>
			</div>
		)
	}

	return (
		<div className='absolute bottom-16 left-0 right-0 flex justify-center'>
			{inner()}
		</div>
	)
}
