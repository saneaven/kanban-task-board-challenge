import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/react'
import type { TaskStatus } from './types'

export type DropTarget = {
  status: TaskStatus
  anchorId: string | null
}

type DragState = {
  taskId: string
  height: number
  target: DropTarget | null
}

function findTarget(x: number, y: number, taskId: string): DropTarget | null {
  const column = document.elementsFromPoint(x, y)
    .map((element) => element.closest<HTMLElement>('[data-col]'))
    .find((element) => element !== null)
  if (!column) return null

  const cards = Array.from(column.querySelectorAll<HTMLElement>('[data-card]'))
    .filter((card) => card.dataset.card !== taskId)
  const anchor = cards.find((card) => {
    const bounds = card.getBoundingClientRect()
    return y < bounds.top + bounds.height / 2
  })

  return { status: column.dataset.col as TaskStatus, anchorId: anchor?.dataset.card ?? null }
}

export function useBoardDrag(onDrop: (taskId: string, target: DropTarget) => void) {
  const [drag, setDrag] = useState<DragState | null>(null)
  const justDragged = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })
  const dragging = drag !== null
  const updateTarget = useCallback(() => {
    const { x, y } = pointer.current
    setDrag((current) => current ? { ...current, target: findTarget(x, y, current.taskId) } : current)
  }, [])

  useEffect(() => {
    if (!dragging) return
    document.addEventListener('scroll', updateTarget, true)
    return () => document.removeEventListener('scroll', updateTarget, true)
  }, [dragging, updateTarget])

  function handleDragStart(event: DragStartEvent) {
    const source = event.operation.source
    if (!source) return
    justDragged.current = true
    const { x, y } = event.operation.position.current
    pointer.current = { x, y }
    setDrag({
      taskId: String(source.id),
      height: source.element?.getBoundingClientRect().height ?? 0,
      target: findTarget(x, y, String(source.id)),
    })
  }

  function handleDragMove(event: DragMoveEvent) {
    const { x, y } = event.to!
    pointer.current = { x, y }
    updateTarget()
  }

  function handleDragEnd(event: DragEndEvent) {
    const source = event.operation.source
    const { x, y } = event.operation.position.current
    const target = source ? findTarget(x, y, String(source.id)) : null
    setDrag(null)
    window.setTimeout(() => { justDragged.current = false }, 60)
    if (!event.canceled && source && target) onDrop(String(source.id), target)
  }

  return { drag, justDragged, handleDragStart, handleDragMove, handleDragEnd }
}
