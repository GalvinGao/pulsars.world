import { IconButton, Input } from '@chakra-ui/react'
import mdiClose from '@iconify/icons-mdi/close'
import mdiSearch from '@iconify/icons-mdi/search'
import { Icon } from '@iconify/react'
import { useAtom } from 'jotai'
import { selectedPulsarIdAtom } from 'models/atoms'
import { Pulsar, pulsars } from 'models/pulsars'
import { useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'

function PulsarItem({ pulsar }: { pulsar: Pulsar }) {
	const [, setSelectedPulsarId] = useAtom(selectedPulsarIdAtom)
	return (
		<button
			key={pulsar.identifier}
			className='mt-2 flex w-full cursor-pointer flex-col gap-1 rounded-lg bg-gray-800 px-3 py-2 transition hover:bg-gray-700 active:bg-gray-600'
			onClick={() => setSelectedPulsarId(pulsar.identifier)}
		>
			<div className='font-mono font-bold text-gray-100'>
				{pulsar.identifier}
			</div>
			<div className='flex items-center gap-2'>
				<div className='h-2 w-2 rounded-full bg-gray-500'></div>
				<div>{pulsar.identifier}</div>
			</div>
		</button>
	)
}

export function PulsarsList() {
	const [expanded, setExpanded] = useState(false)
	const [search, setSearch] = useState('')

	const filteredPulsars = useMemo(() => {
		if (!search) return pulsars

		return pulsars.filter(pulsar => {
			return pulsar.identifier.toLowerCase().includes(search.toLowerCase())
		})
	}, [search])

	const itemContent = (_: number, pulsar: Pulsar) => (
		<PulsarItem key={pulsar.identifier} pulsar={pulsar} />
	)

	const overlay = useMemo(
		() => (
			<div className='absolute right-0 top-0 bottom-0 flex h-full w-60 flex-col bg-slate-900 p-4 pb-0'>
				<div className='flex items-center justify-between'>
					<h2 className='pb-2 text-lg font-bold text-gray-100'>Pulsars</h2>
					<IconButton
						aria-label='Close'
						onClick={() => setExpanded(false)}
						icon={<Icon icon={mdiClose} />}
						size='sm'
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
			</div>
		),
		[filteredPulsars, search]
	)

	return (
		<>
			<div className='absolute right-0 top-0 p-4'>
				<IconButton
					aria-label='Search database'
					onClick={() => setExpanded(true)}
					className='absolute right-0 top-0'
					icon={<Icon icon={mdiSearch} />}
				/>
			</div>

			{expanded && overlay}
		</>
	)
}
