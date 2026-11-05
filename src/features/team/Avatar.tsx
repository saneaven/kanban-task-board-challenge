import type { Member } from '../board/types'
import styles from './Avatar.module.css'

export function Avatar({ member, className = '' }: { member: Member; className?: string }) {
  return (
    <span className={`${styles.avatar} ${className}`} style={{ background: member.color }} title={member.name}>
      {member.initials}
    </span>
  )
}
