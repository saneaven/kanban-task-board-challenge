import { useRef, useState, type KeyboardEvent } from 'react'
import styles from './InlineEdit.module.css'

type InlineEditProps = {
  as: 'h2' | 'p'
  label: string
  value: string
  className?: string
  placeholder?: string
  emptyError?: string
  multiline?: boolean
  onSave: (value: string) => void
}

export function InlineEdit({
  as: Tag,
  label,
  value,
  className = '',
  placeholder,
  emptyError,
  multiline = false,
  onSave,
}: InlineEditProps) {
  const [mode, setMode] = useState<'reading' | 'editing' | 'returned'>('reading')
  const [draft, setDraft] = useState(value)
  const [showError, setShowError] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [lastValue, setLastValue] = useState(value)
  const keyboardExit = useRef<'save' | 'cancel' | null>(null)

  if (value !== lastValue) {
    setLastValue(value)
    setSaved(null)
  }
  const shown = saved ?? value

  function startEditing() {
    setDraft(shown)
    setShowError(false)
    setMode('editing')
  }

  function handleBlur() {
    const text = draft.trim()
    if (keyboardExit.current !== 'cancel' && text !== shown && (text || !emptyError)) {
      setSaved(text)
      onSave(text)
    }
    setMode(keyboardExit.current ? 'returned' : 'reading')
    keyboardExit.current = null
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing) return

    if (event.key === 'Escape') {
      event.preventDefault()
      keyboardExit.current = 'cancel'
      event.currentTarget.blur()
    } else if (event.key === 'Enter' && (!multiline || event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      if (emptyError && !draft.trim()) {
        setShowError(true)
      } else {
        keyboardExit.current = 'save'
        event.currentTarget.blur()
      }
    }
  }

  if (mode !== 'editing') {
    return (
      <Tag className={className}>
        <button
          type="button"
          className={`${styles.reading} ${shown ? '' : styles.empty}`}
          title={`Edit ${label.toLowerCase()}`}
          autoFocus={mode === 'returned'}
          onClick={startEditing}
        >
          {shown || placeholder}
        </button>
      </Tag>
    )
  }

  return (
    <>
      <Tag className={className}>
        <span className={styles.sizer} data-value={draft}>
          <textarea
            className={styles.input}
            aria-label={label}
            aria-invalid={showError}
            rows={1}
            value={draft}
            enterKeyHint={multiline ? 'enter' : 'done'}
            autoFocus
            onFocus={(event) => event.currentTarget.setSelectionRange(draft.length, draft.length)}
            onChange={(event) => {
              setDraft(multiline ? event.target.value : event.target.value.replace(/\s*\n\s*/g, ' '))
              setShowError(false)
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
        </span>
      </Tag>
      {showError && <p className={styles.error} role="alert">{emptyError}</p>}
    </>
  )
}
