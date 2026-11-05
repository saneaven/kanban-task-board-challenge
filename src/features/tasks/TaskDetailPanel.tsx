import type { ReactNode } from 'react'
import { Dialog } from '../../ui/Dialog'
import { CloseIcon } from '../../ui/icons'
import inputStyles from '../../ui/Input.module.css'
import { OptionButton, OptionRow } from '../../ui/Option'
import { ActivityTimeline } from '../activity/ActivityTimeline'
import { columns, columnsByStatus, labels, members, priorities, type MockTask } from '../board/mockData'
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

export function TaskDetailPanel({ task, onClose }: { task: MockTask; onClose: () => void }) {
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
                  {priority}
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
                <OptionButton key={member.id} selected={task.assignees.includes(member)}>
                  <Avatar member={member} className={styles.optionAvatar} />
                  {member.name}
                </OptionButton>
              ))}
            </Property>
            <Property name="Labels">
              {labels.map((label) => (
                <OptionButton key={label} selected={task.labels.includes(label)}>
                  {label}
                </OptionButton>
              ))}
            </Property>
          </div>

          <section className={styles.feed} aria-label="Activity">
            <h3 className={styles.feedTitle}>Activity</h3>
            <ActivityTimeline items={task.timeline} />
            <CommentForm />
          </section>
        </div>
      </div>
    </Dialog>
  )
}
