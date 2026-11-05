import type { MockDue } from '../board/mockData'
import styles from './DueBadge.module.css'

const toneClass = {
  soon: styles.soon,
  overdue: styles.overdue,
}

export function DueBadge({ due }: { due: MockDue }) {
  return <span className={`${styles.due} ${due.tone ? toneClass[due.tone] : ''}`}>{due.label}</span>
}
