import type { Due } from '../board/types'
import styles from './DueBadge.module.css'

const toneClass = {
  soon: styles.soon,
  overdue: styles.overdue,
}

export function DueBadge({ due }: { due: Due }) {
  return <span className={`${styles.due} ${due.tone ? toneClass[due.tone] : ''}`}>{due.label}</span>
}
