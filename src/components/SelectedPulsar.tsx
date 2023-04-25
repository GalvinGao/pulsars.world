import { Button, CloseButton } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { selectedPulsarIdAtom } from 'models/atoms'
import { Pulsar, pulsars } from 'models/pulsars'
import { ReactNode, useMemo, useState } from 'react'

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
					<div className='font-mono text-gray-100'>{children}</div>
				</div>
			))}
		</>
	)
}

export function PulsarFacts({
	pulsar,
	clearSelection
}: {
	pulsar: Pulsar
	clearSelection: () => void
}) {
	const [expanded, setExpanded] = useState(false)

	return (
		<motion.div
			layoutRoot
			className='relative flex w-96 flex-col gap-2 rounded-lg bg-gray-800 p-4 pt-3'
		>
			<div className='flex items-center justify-between'>
				<div className='text-lg font-bold text-gray-100'>
					{pulsar.identifier}
				</div>
				<div className='-mx-2 -my-1 flex justify-end'>
					<CloseButton onClick={() => clearSelection()} />
				</div>
			</div>

			<FactList
				facts={[
					{
						label: 'Distance',
						children: `${pulsar.distanceKpc} Kpc`
					},
					{
						label: 'Period',
						children: `${pulsar.periodS.toPrecision(10)} secs`
					}
				]}
			/>

			{expanded ? (
				<motion.div
					layout
					layoutId={'pulsar-expansion:' + pulsar.identifier}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ type: 'spring', damping: 55, stiffness: 400 }}
					className='flex flex-col gap-2'
				>
					<FactList
						facts={[
							{
								label: 'Dispersion Measure',
								children: `${pulsar.dm} pc/cm^3`
							},
							{
								label: 'Declination',
								children: pulsar.raw.declination
							},
							{
								label: 'Right Ascension',
								children: pulsar.raw.rightAscension
							},
							{
								label: 'Distance (derived DM)',
								children: `${pulsar.raw.distanceDmKpc} Kpc`
							},
							{
								label: 'SIMBAD',
								children: (
									<a
										href={`http://simbad.u-strasbg.fr/simbad/sim-basic?Ident=PSR%20${pulsar.identifier}&submit=SIMBAD+search`}
										target='_blank'
										rel='noreferrer'
										className='rounded-lg border-none bg-gray-700 px-2 py-1 text-gray-100 outline-blue-400 transition-all focus-within:outline-4 hover:bg-gray-600'
									>
										PSR {pulsar.identifier}
									</a>
								)
							}
						]}
					/>
				</motion.div>
			) : (
				<motion.div
					layout
					layoutId={'pulsar-expansion:' + pulsar.identifier}
					className='w-full'
				>
					<Button
						className='w-full'
						size='sm'
						onClick={() => setExpanded(true)}
					>
						Show more
					</Button>
				</motion.div>
			)}
		</motion.div>
	)
}

export function SelectedPulsar() {
	const [selectedPulsarId, setSelectedPulsarId] = useAtom(selectedPulsarIdAtom)

	const selectedPulsar = useMemo(() => {
		if (!selectedPulsarId) return null
		return pulsars.find(p => p.identifier === selectedPulsarId)
	}, [selectedPulsarId])

	return (
		<AnimatePresence>
			{selectedPulsar ? (
				<motion.div
					key={'selected-pulsar:' + selectedPulsar.identifier}
					initial={{ opacity: 0, y: 40, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 40, scale: 0.8 }}
					transition={{ type: 'spring', damping: 55, stiffness: 400 }}
					className='absolute bottom-16 left-0 right-0 flex justify-center'
				>
					<PulsarFacts
						pulsar={selectedPulsar}
						clearSelection={() => setSelectedPulsarId(null)}
					/>
				</motion.div>
			) : (
				<motion.div
					key='selected-pulsar:empty'
					initial={{ opacity: 0 }}
					animate={{ opacity: 0 }}
					exit={{ opacity: 0 }}
				/>
			)}
		</AnimatePresence>
	)
}
