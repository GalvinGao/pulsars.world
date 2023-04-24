import { atom } from 'jotai'

export const timeScaleAtom = atom<number>(1)
export const objectScaleAtom = atom<number>(0.5)
export const selectedPulsarIdAtom = atom<string | null>(null)
