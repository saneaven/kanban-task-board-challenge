import type { ReactNode } from 'react'
import { Dialog } from '../../ui/Dialog'
import { CloseIcon } from '../../ui/icons'
import inputStyles from '../../ui/Input.module.css'
import { OptionButton, OptionRow } from '../../ui/Option'
import { ActivityTimeline } from '../activity/ActivityTimeline'
import { columns, columnsByStatus } from '../board/columns'
import { priorities, priorityNames, type Label, type Member, type Task } from '../board/types'
import { CommentForm } from '../comments/CommentForm'
import { Avatar } from '../team/Avatar'
import { DueBadge } from './DueBadge'
import styles from './TaskDetailPanel.module.css'

function Property({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className={styles.property} role="group" aria-label={name}>
      <span className={styles.propertyName}>{name}</span>
      <OptionRow>{children}</OptionRow>
    </div>
  )
}

type TaskDetailPanelProps = {
  task: Task
  members: Member[]
  labels: Label[]
  onClose: () => void
}

export function TaskDetailPanel({ task, members, labels, onClose }: TaskDetailPanelProps) {
  const column = columnsByStatus[task.status]

  return (
    <Dialog label="Task details" className={styles.panel} style={{ background: column.color }} onClose={onClose}>
      <div className={styles.layout}>
        <header className={styles.top}>
          <span className={styles.statusName}>{column.name}</span>
          <button type="button" className={styles.close} aria-label="Close task details" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <div className={styles.scroll}>
          <h2 className={styles.title}>{task.title}</h2>
          {task.description && <p className={styles.description}>{task.description}</p>}

          <div className={styles.properties}>
            <Property name="Status">
              {columns.map((option) => (
                <OptionButton key={option.status} selected={option.status === task.status}>
                  {option.name}
                </OptionButton>
              ))}
            </Property>
            <Property name="Priority">
              {priorities.map((priority) => (
                <OptionButton key={priority} selected={priority === task.priority}>
                  {priorityNames[priority]}
                </OptionButton>
              ))}
            </Property>
            <div className={styles.property}>
              <label className={styles.propertyName} htmlFor="task-due">
                Due
              </label>
              <OptionRow>
                <input
                  id="task-due"
                  className={`${inputStyles.input} ${styles.dueInput}`}
                  type="date"
                  defaultValue={task.due?.date}
                />
                {task.due?.tone && <DueBadge due={task.due} />}
              </OptionRow>
            </div>
            <Property name="Assignees">
              {members.map((member) => (
                <OptionButton key={member.id} selected={task.assignees.some((assignee) => assignee.id === member.id)}>
                  <Avatar member={member} className={styles.optionAvatar} />
                  {member.name}
                </OptionButton>
              ))}
            </Property>
            <Property name="Labels">
              {labels.map((label) => (
                <OptionButton key={label.id} selected={task.labels.some((selected) => selected.id === label.id)}>
                  {label.name}
                </OptionButton>
              ))}
            </Property>
          </div>

          <section className={styles.feed} aria-label="Activity">
            <h3 className={styles.feedTitle}>Activity</h3>
            <ActivityTimeline items={[]} />
            <CommentForm />
          </section>
        </div>
      </div>
    </Dialog>
  )
}
