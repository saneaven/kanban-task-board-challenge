import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AddNameForm } from '../../ui/AddNameForm'
import { Dialog } from '../../ui/Dialog'
import { CloseIcon } from '../../ui/icons'
import { InlineEdit } from '../../ui/InlineEdit'
import inputStyles from '../../ui/Input.module.css'
import { OptionAdd, OptionButton, OptionRow } from '../../ui/Option'
import { ActivityTimeline } from '../activity/ActivityTimeline'
import { useTaskTimeline } from '../activity/useTaskTimeline'
import { columns, columnsByStatus } from '../board/columns'
import { priorities, priorityNames, type Label, type Member, type Priority, type Task, type TaskStatus } from '../board/types'
import { CommentForm } from '../comments/CommentForm'
import { AddMemberForm } from '../team/AddMemberForm'
import { Avatar } from '../team/Avatar'
import { DeleteTask } from './DeleteTask'
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
  toast: ReactNode
  onStatusChange: (status: TaskStatus) => void
  onPriorityChange: (priority: Priority) => void
  onDueChange: (date: string | null) => void
  onAssigneeToggle: (member: Member) => void
  onLabelToggle: (label: Label) => void
  onComment: (body: string) => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string | null) => void
  onMemberCreate: (name: string) => void
  onLabelCreate: (name: string) => void
  onDelete: () => void
  onClose: () => void
}

export function TaskDetailPanel({
  task,
  members,
  labels,
  toast,
  onStatusChange,
  onPriorityChange,
  onDueChange,
  onAssigneeToggle,
  onLabelToggle,
  onComment,
  onTitleChange,
  onDescriptionChange,
  onMemberCreate,
  onLabelCreate,
  onDelete,
  onClose,
}: TaskDetailPanelProps) {
  const savedDue = task.due?.date ?? ''
  const [dueDraft, setDueDraft] = useState(savedDue)

  useLayoutEffect(() => {
    setDueDraft(savedDue)
  }, [savedDue])

  const column = columnsByStatus[task.status]
  const timeline = useTaskTimeline(task.id)
  const scroll = useRef<HTMLDivElement>(null)
  const revealNewComment = useRef(false)

  useLayoutEffect(() => {
    if (revealNewComment.current && scroll.current) {
      revealNewComment.current = false
      scroll.current.scrollTop = scroll.current.scrollHeight
    }
  }, [timeline.items.length])

  return (
    <Dialog label="Task details" className={styles.panel} style={{ background: column.color }} onClose={onClose}>
      <div className={styles.layout}>
        <header className={styles.top}>
          <span className={styles.statusName}>{column.name}</span>
          <button type="button" className={styles.close} aria-label="Close task details" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <div ref={scroll} className={styles.scroll}>
          <InlineEdit
            as="h2"
            className={styles.title}
            label="Task title"
            value={task.title}
            emptyError="Give the task a title first."
            onSave={onTitleChange}
          />
          <InlineEdit
            as="p"
            className={styles.description}
            label="Task description"
            value={task.description ?? ''}
            placeholder="Add a description"
            multiline
            onSave={(description) => onDescriptionChange(description || null)}
          />

          <div className={styles.properties}>
            <Property name="Status">
              {columns.map((option) => (
                <OptionButton
                  key={option.status}
                  selected={option.status === task.status}
                  onClick={() => { if (option.status !== task.status) onStatusChange(option.status) }}
                >
                  {option.name}
                </OptionButton>
              ))}
            </Property>
            <Property name="Priority">
              {priorities.map((priority) => (
                <OptionButton key={priority} selected={priority === task.priority} onClick={() => { if (priority !== task.priority) onPriorityChange(priority) }}>
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
                  value={dueDraft}
                  onChange={(event) => setDueDraft(event.target.value)}
                  onBlur={() => {
                    if (dueDraft !== savedDue) onDueChange(dueDraft || null)
                  }}
                />
                {task.due && <DueBadge due={task.due} />}
              </OptionRow>
            </div>
            <Property name="Assignees">
              {members.map((member) => (
                <OptionButton key={member.id} selected={task.assignees.some((assignee) => assignee.id === member.id)} onClick={() => onAssigneeToggle(member)}>
                  <Avatar member={member} className={styles.optionAvatar} />
                  {member.name}
                </OptionButton>
              ))}
              <OptionAdd label="New member">
                {(close) => <AddMemberForm variant="primary" onAdd={onMemberCreate} onClose={close} />}
              </OptionAdd>
            </Property>
            <Property name="Labels">
              {labels.map((label) => (
                <OptionButton key={label.id} selected={task.labels.some((selected) => selected.id === label.id)} onClick={() => onLabelToggle(label)}>
                  {label.name}
                </OptionButton>
              ))}
              <OptionAdd label="New label">
                {(close) => <AddNameForm label="New label name" placeholder="Label name" onAdd={onLabelCreate} onClose={close} />}
              </OptionAdd>
            </Property>
            <div className={styles.property}>
              <div className={styles.propertyValue}>
                <DeleteTask onDelete={onDelete} />
              </div>
            </div>
          </div>

          <section className={styles.feed} aria-label="Activity">
            <h3 className={styles.feedTitle}>Activity</h3>
            {timeline.isError && (
              <p className={styles.feedError} role="alert">
                Couldn’t load activity. <button type="button" className={styles.feedRetry} onClick={timeline.retry}>Retry</button>
              </p>
            )}
            <ActivityTimeline items={timeline.items} />
          </section>
        </div>

        <div className={styles.footer}>
          <CommentForm
            onComment={(body) => {
              revealNewComment.current = true
              onComment(body)
            }}
          />
          {toast}
        </div>
      </div>
    </Dialog>
  )
}
