import type { ReactNode } from 'react'
import styles from './Option.module.css'

export function OptionRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}

export function OptionButton({ selected, onClick, children }: { selected: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`${styles.option} ${selected ? styles.selected : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  )
}
