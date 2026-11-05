import { ChatIcon } from '../../ui/icons'
import type { MockTask } from '../board/mockData'
import { Avatar } from '../team/Avatar'
import { DueBadge } from './DueBadge'
import styles from './TaskCard.module.css'

export function TaskCard({ task, onOpen }: { task: MockTask; onOpen: () => void }) {
  const commentCount = task.timeline.filter((item) => item.kind === 'comment').length

  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      {task.priority === 'High' && <span className={styles.highTag}>High</span>}
      <span className={styles.title}>{task.title}</span>
      <span className={styles.labels}>
        {task.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </span>
      <span className={styles.footer}>
        {task.due && <DueBadge due={task.due} />}
        <span className={styles.meta}>
          {commentCount > 0 && (
            <span className={styles.comments}>
              <ChatIcon />
              {commentCount}
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
