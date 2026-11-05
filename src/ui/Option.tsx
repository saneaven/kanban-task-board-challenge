import type { ReactNode } from 'react'
import styles from './Option.module.css'

export function OptionRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}

export function OptionButton({ selected, children }: { selected: boolean; children: ReactNode }) {
  return (
    <button type="button" className={`${styles.option} ${selected ? styles.selected : ''}`} aria-pressed={selected}>
      {children}
    </button>
  )
}
