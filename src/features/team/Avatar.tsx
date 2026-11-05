import type { MockMember } from '../board/mockData'
import styles from './Avatar.module.css'

export function Avatar({ member, className = '' }: { member: MockMember; className?: string }) {
  return (
    <span className={`${styles.avatar} ${className}`} style={{ background: member.color }} title={member.name}>
      {member.initials}
    </span>
  )
}
