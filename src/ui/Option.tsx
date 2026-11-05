import { useRef, useState, type ReactNode } from 'react'
import { PlusIcon } from './icons'
import styles from './Option.module.css'

export function OptionRow({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}

export function OptionButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={`${styles.option} ${selected ? styles.selected : ''}`} aria-pressed={selected} onClick={onClick}>
      {children}
    </button>
  )
}

export function OptionAdd({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={toggle}
        type="button"
        className={`${styles.option} ${styles.add}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusIcon />
        {label}
      </button>
      {isOpen && children(() => {
        setIsOpen(false)
        toggle.current?.focus()
      })}
    </>
  )
}
