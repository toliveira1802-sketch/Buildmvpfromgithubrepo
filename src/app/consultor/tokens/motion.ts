// src/app/consultor/tokens/motion.ts
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
}

export const dur = {
  fast: 0.14,
  base: 0.22,
  slow: 0.36,
}

export const stagger = {
  list: 0.018,
}

export const spring = {
  panel: { type: 'spring' as const, stiffness: 320, damping: 34 },
}
