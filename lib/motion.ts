export const ease = [0.22, 1, 0.36, 1] as const

export const duration = {
  fast: 0.4,
  medium: 0.7,
  slow: 1,
} as const

export const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 1.04 },
  show: { opacity: 1, scale: 1 },
}
