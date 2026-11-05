import type { FormEvent } from 'react'
import { Button } from '../../ui/Button'
import inputStyles from '../../ui/Input.module.css'
import styles from './AddMemberForm.module.css'

export function AddMemberForm({ onClose }: { onClose: () => void }) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="member-name">
        Team member name
      </label>
      <input id="member-name" className={`${inputStyles.input} ${styles.input}`} type="text" placeholder="Name" autoFocus />
      <Button variant="accent" type="submit">
        Add
      </Button>
    </form>
  )
}
