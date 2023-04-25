import { Divider, Heading, IconButton, Input, Text } from '@chakra-ui/react'
import mdiClose from '@iconify/icons-mdi/close'
import mdiGithub from '@iconify/icons-mdi/github'
import mdiInformation from '@iconify/icons-mdi/information'
import mdiSearch from '@iconify/icons-mdi/search'
import mdiStar from '@iconify/icons-mdi/star'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { LinkButton } from 'components/LinkButton'
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

function PulsarExpandedPanel({ onClose }: { onClose: () => void }) {
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
				className='absolute right-0 top-0 bottom-0 z-10 flex h-full w-80 flex-col bg-slate-900 p-4 pr-8 pb-0'
			>
				<div className='mb-2 flex items-center justify-between'>
					<h2 className='text-lg font-bold text-gray-100'>Search</h2>
					<IconButton
						aria-label='Close'
						onClick={onClose}
						icon={<Icon icon={mdiClose} />}
						size='md'
						className='bg-transparent'
					/>
				</div>
				<div>
					<Input
						placeholder='e.g. J0709-5923'
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
		[filteredPulsars, search, itemContent, onClose]
	)

	return overlay
}

function CreditsSection({
	title,
	credits
}: {
	title: string
	credits: { name: string; url?: string }[]
}) {
	return (
		<div className='flex flex-col gap-1'>
			<div className='text-gray-100'>{title}</div>
			<div className='flex flex-col items-start gap-1 text-gray-400'>
				{credits.map(credit =>
					credit.url ? (
						<a
							key={credit.name}
							href={credit.url}
							target='_blank'
							rel='noopener noreferrer'
							className='rounded border-l-4 border-gray-400 bg-gray-700 px-2 py-1 text-gray-100 outline-blue-400 transition-all focus-within:outline-4 hover:border-blue-400 hover:bg-gray-600 active:bg-gray-500'
						>
							{credit.name}
						</a>
					) : (
						credit.name
					)
				)}
			</div>
		</div>
	)
}

function AboutPanel({ onClose }: { onClose: () => void }) {
	return (
		<motion.div
			key='overlay'
			initial={{ opacity: 0, x: 100, pointerEvents: 'none' }}
			animate={{ opacity: 1, x: 16, pointerEvents: 'auto' }}
			exit={{ opacity: 0, x: 100, pointerEvents: 'none' }}
			className='absolute right-0 top-0 bottom-0 z-10 flex h-full w-80 flex-col bg-slate-900 p-4 pr-8 pb-0 shadow-md'
		>
			<div className='mb-2 flex items-center justify-between'>
				<h2 className='text-lg font-bold text-gray-100'>About</h2>
				<IconButton
					aria-label='Close'
					onClick={onClose}
					icon={<Icon icon={mdiClose} />}
					size='md'
					className='bg-transparent'
				/>
			</div>

			<div className='flex flex-col gap-4 overflow-auto pb-8'>
				<Heading size='sm'>Acknowledgements</Heading>

				<Text>
					The project sincerely appreciate the following projects/works for
					their contributions to this project. Without them, this project would
					not be possible.
				</Text>

				<CreditsSection
					title='Pulsar Database & Tools'
					credits={[
						{
							name: 'ATNF Pulsar Catalogue (Australia Telescope National Facility)',
							url: 'https://www.atnf.csiro.au/research/pulsar/psrcat/'
						},
						{
							name: 'SIMBAD Astronomical Database (Centre de Données astronomiques de Strasbourg)',
							url: 'http://simbad.u-strasbg.fr/simbad/'
						}
					]}
				/>

				<CreditsSection
					title='Web Development'
					credits={[
						{
							name: 'React',
							url: 'https://react.dev/'
						},
						{
							name: 'THREE.js',
							url: 'https://threejs.org/'
						},
						{
							name: 'Virtuoso',
							url: 'https://virtuoso.dev/'
						},
						{
							name: 'Chakra UI',
							url: 'https://chakra-ui.com/'
						},
						{
							name: 'Tailwind CSS',
							url: 'https://tailwindcss.com/'
						},
						{
							name: 'React Three Fiber',
							url: 'https://docs.pmnd.rs/react-three-fiber/getting-started/introduction'
						}
					]}
				/>

				<CreditsSection
					title='Design Assets'
					credits={[
						{
							name: 'Material Design Icons',
							url: 'https://materialdesignicons.com/'
						},
						{
							name: 'IBM Plex Sans',
							url: 'https://fonts.google.com/specimen/IBM+Plex+Sans'
						},
						{
							name: 'IBM Plex Mono',
							url: 'https://fonts.google.com/specimen/IBM+Plex+Mono'
						}
					]}
				/>

				<Divider />

				<Heading size='sm'>About pulsars.world</Heading>

				<LinkButton href='https://github.com/GalvinGao/pulsars.world'>
					<Icon icon={mdiGithub} />
					<span>Source Code on GitHub</span>
				</LinkButton>
			</div>
		</motion.div>
	)
}

export function PulsarsList() {
	const [expanded, setExpanded] = useState<'pulsar-list' | 'credits' | null>(
		null
	)

	const panels = useMemo(
		() => ({
			'pulsar-list': (
				<PulsarExpandedPanel key={expanded} onClose={() => setExpanded(null)} />
			),
			credits: <AboutPanel key={expanded} onClose={() => setExpanded(null)} />
		}),
		[expanded]
	)

	return (
		<>
			<div className='absolute right-0 top-0 flex items-center gap-2 p-4'>
				<IconButton
					aria-label='Search database'
					onClick={() => setExpanded('pulsar-list')}
					icon={<Icon icon={mdiSearch} />}
					size='md'
				/>

				<IconButton
					aria-label='Credits'
					onClick={() => setExpanded('credits')}
					className='absolute right-0 top-0'
					icon={<Icon icon={mdiInformation} />}
					size='md'
				/>
			</div>

			<AnimatePresence>{expanded && panels[expanded]}</AnimatePresence>
		</>
	)
}
