import type { Column, TaskStatus } from './types'

export const columnsByStatus: Record<TaskStatus, Column> = {
  todo: {
    status: 'todo',
    name: 'To Do',
    color: 'var(--color-status-todo)',
    hint: 'Nothing queued. Add a task to get started.',
    skeletonCount: 3,
  },
  in_progress: {
    status: 'in_progress',
    name: 'In Progress',
    color: 'var(--color-status-in-progress)',
    hint: 'Drag a task here when work starts.',
    skeletonCount: 2,
  },
  in_review: {
    status: 'in_review',
    name: 'In Review',
    color: 'var(--color-status-in-review)',
    hint: 'Drop tasks here when they need a second look.',
    skeletonCount: 2,
  },
  done: {
    status: 'done',
    name: 'Done',
    color: 'var(--color-status-done)',
    hint: 'Finished tasks land here.',
    skeletonCount: 1,
  },
}

export const columns = Object.values(columnsByStatus)
