import { useLayoutEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react'

type DialogProps = {
  label: string
  className?: string
  style?: CSSProperties
  onClose: () => void
  children: ReactNode
}

export function Dialog({ label, className, style, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    dialog.showModal()
    return () => dialog.close()
  }, [])

  function handleCancel(event: SyntheticEvent) {
    event.preventDefault()
    const activeElement = document.activeElement as HTMLElement | null
    activeElement?.blur()
    onClose()
  }

  // Dialog content fills the element, so a click on the element itself is a click on the backdrop.
  function handleClick(event: MouseEvent) {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <dialog ref={ref} aria-label={label} className={className} style={style} onCancel={handleCancel} onClick={handleClick}>
      {children}
    </dialog>
  )
}
