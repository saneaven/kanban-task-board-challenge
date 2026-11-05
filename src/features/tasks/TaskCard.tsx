import { ChatIcon } from '../../ui/icons'
import type { MockTask } from '../board/mockData'
import { Avatar } from '../team/Avatar'
import styles from './TaskCard.module.css'

const dueToneClass = {
  soon: styles.dueSoon,
  overdue: styles.dueOverdue,
}

export function TaskCard({ task }: { task: MockTask }) {
  return (
    <button type="button" className={styles.card}>
      {task.isHighPriority && <span className={styles.highTag}>High</span>}
      <span className={styles.title}>{task.title}</span>
      <span className={styles.labels}>
        {task.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </span>
      <span className={styles.footer}>
        {task.due && (
          <span className={`${styles.due} ${task.due.tone ? dueToneClass[task.due.tone] : ''}`}>{task.due.label}</span>
        )}
        <span className={styles.meta}>
          {task.commentCount && (
            <span className={styles.comments}>
              <ChatIcon />
              {task.commentCount}
            </span>
          )}
          <span className={styles.assignees}>
            {task.assignees.map((member) => (
              <Avatar key={member.id} member={member} className={styles.avatar} />
            ))}
          </span>
        </span>
      </span>
    </button>
  )
}
