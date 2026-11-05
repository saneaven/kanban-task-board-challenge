import { useId, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from './Button'
import inputStyles from './Input.module.css'
import styles from './AddNameForm.module.css'

type AddNameFormProps = {
  label: string
  placeholder: string
  variant?: 'primary' | 'accent'
  onAdd: (name: string) => void
  onClose: () => void
}

export function AddNameForm({ label, placeholder, variant = 'primary', onAdd, onClose }: AddNameFormProps) {
  const [name, setName] = useState('')
  const id = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    onClose()
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${inputStyles.input} ${styles.input}`}
        type="text"
        placeholder={placeholder}
        value={name}
        autoFocus
        onChange={(event) => setName(event.target.value)}
      />
      <Button variant={variant} type="submit">
        Add
      </Button>
    </form>
  )
}
