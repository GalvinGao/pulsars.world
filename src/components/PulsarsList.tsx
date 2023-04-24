import { IconButton, Input } from '@chakra-ui/react'
import mdiClose from '@iconify/icons-mdi/close'
import mdiSearch from '@iconify/icons-mdi/search'
import mdiStar from '@iconify/icons-mdi/star'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { selectedPulsarIdAtom } from 'models/atoms'
import { Pulsar, pulsars } from 'models/pulsars'
import { useCallback, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import styles from './PulsarsList.module.css'

const featuredPulsars = new Set(['J0534+2200', 'J1725-0732', 'J0537-6910'])

function PulsarItem({ pulsar }: { pulsar: Pulsar }) {
	const [, setSelectedPulsarId] = useAtom(selectedPulsarIdAtom)
	const isFeatured = featuredPulsars.has(pulsar.identifier)

	return (
		<button
			key={pulsar.identifier}
			className='mt-2 flex w-full cursor-pointer flex-col gap-1 rounded-lg bg-gray-800 px-3 py-2 transition hover:bg-gray-700 active:bg-gray-600'
			onClick={() => setSelectedPulsarId(pulsar.identifier)}
		>
			<div className='flex items-center'>
				{isFeatured && <Icon icon={mdiStar} className='mr-2 text-yellow-400' />}
				<div className='font-mono font-bold text-gray-100'>
					{pulsar.identifier}
				</div>
			</div>
			<div
				className={clsx('flex items-center gap-2', styles['anim-pulsar'])}
				style={{
					animationDuration: `${pulsar.periodS}s`
				}}
			>
				<div className='h-2 w-2 rounded-full bg-white'></div>
				<div className='opacity-50'>{pulsar.periodS.toPrecision(2)}s</div>
			</div>
		</button>
	)
}

export function PulsarsList() {
	const [expanded, setExpanded] = useState(false)
	const [search, setSearch] = useState('')

	const filteredPulsars = useMemo(() => {
		const candidates = search
			? pulsars.filter(pulsar => {
					return pulsar.identifier.toLowerCase().includes(search.toLowerCase())
			  })
			: pulsars

		// sort by featured pulsars
		const sorted = candidates.sort((a, b) => {
			const aFeatured = featuredPulsars.has(a.identifier)
			const bFeatured = featuredPulsars.has(b.identifier)
			if (aFeatured && !bFeatured) return -1
			if (!aFeatured && bFeatured) return 1
			return 0
		})

		return sorted
	}, [search])

	const itemContent = useCallback(
		(_: number, pulsar: Pulsar) => (
			<PulsarItem key={pulsar.identifier} pulsar={pulsar} />
		),
		[]
	)

	const overlay = useMemo(
		() => (
			<motion.div
				key='overlay'
				initial={{ opacity: 0, x: 100, pointerEvents: 'none' }}
				animate={{ opacity: 1, x: 16, pointerEvents: 'auto' }}
				exit={{ opacity: 0, x: 100, pointerEvents: 'none' }}
				className='absolute right-0 top-0 bottom-0 flex h-full w-80 flex-col bg-slate-900 p-4 pr-8 pb-0'
			>
				<div className='mb-2 flex items-center justify-between'>
					<h2 className='text-lg font-bold text-gray-100'>Pulsars</h2>
					<IconButton
						aria-label='Close'
						onClick={() => setExpanded(false)}
						icon={<Icon icon={mdiClose} />}
						size='md'
						className='bg-transparent'
					/>
				</div>
				<div>
					<Input
						placeholder='Search'
						size='lg'
						onChange={e => setSearch(e.target.value)}
						value={search}
					/>
				</div>
				<Virtuoso
					className='flex flex-col overflow-auto py-2'
					data={filteredPulsars}
					itemContent={itemContent}
					overscan={150}
				/>
				{filteredPulsars.length === 0 && (
					<div className='mt-4 flex h-full flex-col gap-2 text-center text-gray-400'>
						<div className='font-mono'>{'¯\\_(ツ)_/¯'}</div>
						<div>No pulsars found with search terms specified.</div>
					</div>
				)}
			</motion.div>
		),
		[filteredPulsars, search, itemContent]
	)

	return (
		<>
			<div className='absolute right-0 top-0 p-4'>
				<IconButton
					aria-label='Search database'
					onClick={() => setExpanded(true)}
					className='absolute right-0 top-0'
					icon={<Icon icon={mdiSearch} />}
					size='md'
				/>
			</div>

			<AnimatePresence>{expanded && overlay}</AnimatePresence>
		</>
	)
}
