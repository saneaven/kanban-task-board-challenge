import { CloseIcon } from './icons'
import styles from './Toast.module.css'

type ToastProps = {
  text: string
  onRetry: () => void
  onDismiss: () => void
}

export function Toast({ text, onRetry, onDismiss }: ToastProps) {
  return (
    <div className={styles.toast} role="status">
      <span>{text}</span>
      <button type="button" className={styles.action} onClick={onRetry}>Retry</button>
      <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
        <CloseIcon />
      </button>
    </div>
  )
}
