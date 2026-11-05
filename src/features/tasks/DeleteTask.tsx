import { useId, useState, type KeyboardEvent } from 'react'
import { Button } from '../../ui/Button'
import styles from './DeleteTask.module.css'

export function DeleteTask({ onDelete }: { onDelete: () => void }) {
  const [step, setStep] = useState<'resting' | 'confirming' | 'returned'>('resting')
  const questionId = useId()

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setStep('returned')
    }
  }

  if (step !== 'confirming') {
    return (
      <Button variant="quiet" autoFocus={step === 'returned'} onClick={() => setStep('confirming')}>
        Delete task
      </Button>
    )
  }

  return (
    <div className={styles.confirm} role="group" aria-labelledby={questionId} onKeyDown={handleKeyDown}>
      <p id={questionId}>Delete this task? Its comments and activity go with it.</p>
      <div className={styles.actions}>
        <Button variant="quiet" autoFocus onClick={() => setStep('returned')}>Cancel</Button>
        <Button variant="danger" onClick={onDelete}>Delete task</Button>
      </div>
    </div>
  )
}
