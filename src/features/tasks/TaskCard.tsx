import { ChatIcon } from '../../ui/icons'
import type { Task } from '../board/types'
import { Avatar } from '../team/Avatar'
import { DueBadge } from './DueBadge'
import styles from './TaskCard.module.css'

export function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      {task.priority === 'high' && <span className={styles.highTag}>High</span>}
      <span className={styles.title}>{task.title}</span>
      <span className={styles.labels}>
        {task.labels.map((label) => (
          <span key={label.id}>{label.name}</span>
        ))}
      </span>
      <span className={styles.footer}>
        {task.due && <DueBadge due={task.due} />}
        <span className={styles.meta}>
          {task.commentCount > 0 && (
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
