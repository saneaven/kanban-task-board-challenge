import { useLayoutEffect, useRef } from 'react'
import { useDraggable } from '@dnd-kit/react'
import { ChatIcon } from '../../ui/icons'
import type { Task } from '../board/types'
import { Avatar } from '../team/Avatar'
import { DueBadge } from './DueBadge'
import styles from './TaskCard.module.css'

type TaskCardProps = {
  task: Task
  onOpen: () => void
  autoFocus?: boolean
  onShift?: (direction: -1 | 1) => void
  isDragging?: boolean
  landed?: boolean
  onLandEnd?: () => void
  overlay?: boolean
}

export function TaskCard({ task, onOpen, onShift, isDragging, landed, onLandEnd, overlay = false, autoFocus }: TaskCardProps) {
  const ref = useRef<HTMLButtonElement>(null)
  useDraggable({ id: task.id, disabled: overlay, element: ref })

  useLayoutEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  return (
    <button
      ref={ref}
      type="button"
      data-card={task.id}
      className={`${styles.card} ${isDragging ? styles.source : ''} ${landed ? styles.landed : ''} ${overlay ? styles.ghost : ''}`}
      tabIndex={overlay ? -1 : 0}
      onClick={onOpen}
      onAnimationEnd={onLandEnd}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          onShift?.(event.key === 'ArrowLeft' ? -1 : 1)
        }
      }}
    >
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
