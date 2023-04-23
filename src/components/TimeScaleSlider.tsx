import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack
} from '@chakra-ui/react'
import { useAtom } from 'jotai'

import { timeScaleAtom } from 'models/atoms'
export function TimeScaleSlider() {
	const [timeScale, setTimeScale] = useAtom(timeScaleAtom)
	return (
		<div className='flex w-full items-center gap-6'>
			<Slider
				className='ml-2 max-w-md'
				min={1e-2}
				max={1}
				step={1e-2}
				onChange={v => setTimeScale(v)}
				value={timeScale}
			>
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
				<SliderThumb />
			</Slider>

			<div>Time: {timeScale.toFixed(2)}x</div>
		</div>
	)
}
