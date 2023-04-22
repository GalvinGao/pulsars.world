import camelcaseKeys from 'camelcase-keys'
import { parse } from 'csv-parse/browser/esm'
import pulsarsCsv from '../assets/pulsars.csv?raw'

// csv: id   ,name         ,right_ascension  ,right_ascension_err ,declination      ,declination_err ,period_s              ,period_s_err ,dm         ,dm_err ,distance_kpc ,distance_dm_kpc
// be sure to use camelcaseKeys
export type Pulsar = {
	id: string
	name: string
	// right ascension (hms).
	// original examples: 02:09:37.304, 00:23:16.877498, 00:33
	rightAscension: string
	rightAscensionErr: string
	// declination.
	// original examples: +08:10, +54:31:47, +73:03:07.4, -09:09:58.7, +09:23:23.8604, +57
	declination: string
	// declination error. examples: 1, 17, 10, 25
	declinationErr: string
	// period (seconds). examples: 0.69374767047, 0.00575677999551635, 2.31413082909
	periodS: string
	periodSErr: string
	// dispersion measurement (cm^-3 pc). examples: 218.6, 11.41, *
	dm: string | null
	dmErr: string
	// distance (kpc). examples: *, 2.140, 2.301
	distanceKpc: string | null
	// distance from dispersion measurement (kpc). examples: *, 2.140, 2.301
	distanceDmKpc: string | null
}

export type TransformedPulsar = {
	id: number
	name: string
	rightAscension: number
	rightAscensionErr: number
	declination: number
	declinationErr: number
	periodS: number
	periodSErr: number
	dm: number | null
	dmErr: number | null
	distanceKpc: number | null
	distanceDmKpc: number | null

	position?: {
		x: number
		y: number
		z: number
	}
}

function hmsToDegrees(hms: string): number {
	const [hours, minutes, seconds] = hms
		.split(':')
		.map(n => Number.parseFloat(n))
	return (hours + minutes / 60 + seconds / 3600) * 15
}

function dmsToDecimalDegrees(dms: string): number {
	const [degrees, arcminutes, arcseconds] = dms
		.split(':')
		.map(n => Number.parseFloat(n))
	const sign = degrees >= 0 ? 1 : -1
	return degrees + sign * (arcminutes / 60 + arcseconds / 3600)
}

function degreesToRadians(degrees: number): number {
	return degrees * (Math.PI / 180)
}

function transformPulsarCoordinates(pulsar: Pulsar): TransformedPulsar {
	const rightAscension = hmsToDegrees(pulsar.rightAscension)
	const declination = dmsToDecimalDegrees(pulsar.declination)
	const distanceKpc = pulsar.distanceKpc
		? Number.parseFloat(pulsar.distanceKpc)
		: null

	return {
		id: Number.parseInt(pulsar.id),
		name: pulsar.name.trim(),
		rightAscension,
		rightAscensionErr: Number.parseFloat(pulsar.rightAscensionErr),
		declination,
		declinationErr: Number.parseFloat(pulsar.declinationErr),
		periodS: Number.parseFloat(pulsar.periodS),
		periodSErr: Number.parseFloat(pulsar.periodSErr),
		dm: !pulsar.dm || pulsar.dm === '*' ? null : Number.parseFloat(pulsar.dm),
		dmErr:
			!pulsar.dmErr || pulsar.dmErr === '*'
				? null
				: Number.parseFloat(pulsar.dmErr),
		distanceKpc,
		distanceDmKpc: pulsar.distanceDmKpc
			? Number.parseFloat(pulsar.distanceDmKpc)
			: null,
		position: (() => {
			if (distanceKpc === null) {
				return undefined
			}

			const rightAscensionRad = degreesToRadians(rightAscension)
			const declinationRad = degreesToRadians(declination)

			const x =
				distanceKpc * Math.cos(declinationRad) * Math.cos(rightAscensionRad)
			const y =
				distanceKpc * Math.cos(declinationRad) * Math.sin(rightAscensionRad)
			const z = distanceKpc * Math.sin(declinationRad)

			return { x, y, z }
		})()
	}
}

export const getPulsars = async (): Promise<TransformedPulsar[]> => {
	console.log('getting pulsars')
	const rows = (
		(await new Promise((resolve, reject) => {
			parse(pulsarsCsv, { columns: true }, (error, results: any) => {
				if (error) {
					reject(error)
				} else {
					resolve(results)
				}
			})
		})) as Pulsar[]
	)
		.map(row => camelcaseKeys(row, { deep: true }))
		.map(row => {
			return transformPulsarCoordinates(row)
		})

	console.log(rows)

	return rows
}
