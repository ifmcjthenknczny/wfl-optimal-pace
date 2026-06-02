import { MOBILE_BREAKPOINT_PX } from '@/config/mobile'

export const calculatePace = (timeMinutes: number, distanceKms: number) => {
  return timeMinutes / distanceKms
}

const toTwoDigits = (value: number) => (value < 10 ? `0${value}` : `${value}`)

export const formatTime = (timeMinutes: number, showEmptyHours: boolean = true) => {
  const totalSeconds = Math.max(0, Math.round(timeMinutes * 60))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${!showEmptyHours && hours === 0 ? '' : `${toTwoDigits(hours)}:`}${toTwoDigits(minutes)}:${toTwoDigits(seconds)}`
}

export const formatPace = (paceMinutesPerKm: number) => {
  const totalSeconds = Math.max(0, Math.round(paceMinutesPerKm * 60))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${toTwoDigits(seconds)} min/km`
}

export const isMobile = () => {
  return window.innerWidth < MOBILE_BREAKPOINT_PX
}
