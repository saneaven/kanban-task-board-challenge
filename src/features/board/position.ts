import type { Task, TaskStatus } from './types'

export function positionBetween(prev: number | null, next: number | null): number {
  if (prev === null) return next === null ? 0 : next - 1
  if (next === null) return prev + 1
  return (prev + next) / 2
}

export function positionForDrop(tasks: Task[], task: Task, status: TaskStatus, anchorId: string | null): number {
  const peers = tasks.filter((peer) => peer.id !== task.id && peer.status === status)
  const index = anchorId === null ? peers.length : peers.findIndex((peer) => peer.id === anchorId)
  const prev = peers[index - 1]?.position ?? null
  const next = peers[index]?.position ?? null

  if (task.status === status
    && (prev === null || task.position > prev)
    && (next === null || task.position < next)) {
    return task.position
  }

  return positionBetween(prev, next)
}
