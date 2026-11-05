import { useState, type FormEvent, type ReactNode } from 'react'
import { Button } from '../../ui/Button'
import { Dialog } from '../../ui/Dialog'
import inputStyles from '../../ui/Input.module.css'
import { OptionButton, OptionRow } from '../../ui/Option'
import { columns } from '../board/columns'
import { priorities, priorityNames, type Priority, type TaskDraft, type TaskStatus } from '../board/types'
import styles from './TaskComposer.module.css'

type TaskComposerProps = {
  status: TaskStatus
  toast: ReactNode
  onCreate: (draft: TaskDraft) => void
  onClose: () => void
}

export function TaskComposer({ status, toast, onCreate, onClose }: TaskComposerProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [columnStatus, setColumnStatus] = useState(status)
  const [error, setError] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!title.trim()) {
      setError(true)
      return
    }

    onCreate({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      dueDate: dueDate || null,
      status: columnStatus,
    })
    onClose()
  }

  return (
    <Dialog label="New task" className={styles.composer} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>New task</h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="composer-title">Title</label>
          <input
            id="composer-title"
            className={inputStyles.input}
            type="text"
            placeholder="What needs doing?"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError(false)
            }}
          />
          {error && <p className={styles.fieldError} role="alert">Give the task a title first.</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="composer-description">Description (optional)</label>
          <textarea
            id="composer-description"
            className={inputStyles.input}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field} role="group" aria-label="Priority">
            <span className={styles.label}>Priority</span>
            <OptionRow>
              {priorities.map((option) => (
                <OptionButton key={option} selected={option === priority} onClick={() => setPriority(option)}>
                  {priorityNames[option]}
                </OptionButton>
              ))}
            </OptionRow>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="composer-due">Due date (optional)</label>
            <input
              id="composer-due"
              className={`${inputStyles.input} ${styles.dueInput}`}
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field} role="group" aria-label="Column">
          <span className={styles.label}>Column</span>
          <OptionRow>
            {columns.map((column) => (
              <OptionButton
                key={column.status}
                selected={column.status === columnStatus}
                onClick={() => setColumnStatus(column.status)}
              >
                {column.name}
              </OptionButton>
            ))}
          </OptionRow>
        </div>

        <div className={styles.actions}>
          <Button variant="quiet" onClick={onClose}>Cancel</Button>
          <Button type="submit">Create task</Button>
        </div>
        {toast}
      </form>
    </Dialog>
  )
}
