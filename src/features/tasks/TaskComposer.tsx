import type { FormEvent } from 'react'
import { Button } from '../../ui/Button'
import { Dialog } from '../../ui/Dialog'
import inputStyles from '../../ui/Input.module.css'
import { OptionButton, OptionRow } from '../../ui/Option'
import { columns, priorities, type TaskStatus } from '../board/mockData'
import styles from './TaskComposer.module.css'

export function TaskComposer({ status, onClose }: { status: TaskStatus; onClose: () => void }) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onClose()
  }

  return (
    <Dialog label="New task" className={styles.composer} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>New task</h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="composer-title">
            Title
          </label>
          <input id="composer-title" className={inputStyles.input} type="text" placeholder="What needs doing?" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="composer-description">
            Description (optional)
          </label>
          <textarea id="composer-description" className={inputStyles.input} rows={3} />
        </div>

        <div className={styles.row}>
          <div className={styles.field} role="group" aria-label="Priority">
            <span className={styles.label}>Priority</span>
            <OptionRow>
              {priorities.map((priority) => (
                <OptionButton key={priority} selected={priority === 'Normal'}>
                  {priority}
                </OptionButton>
              ))}
            </OptionRow>
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="composer-due">
              Due date (optional)
            </label>
            <input id="composer-due" className={`${inputStyles.input} ${styles.dueInput}`} type="date" />
          </div>
        </div>

        <div className={styles.field} role="group" aria-label="Column">
          <span className={styles.label}>Column</span>
          <OptionRow>
            {columns.map((column) => (
              <OptionButton key={column.status} selected={column.status === status}>
                {column.name}
              </OptionButton>
            ))}
          </OptionRow>
        </div>

        <div className={styles.actions}>
          <Button variant="quiet" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create task</Button>
        </div>
      </form>
    </Dialog>
  )
}
