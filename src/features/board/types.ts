export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'

export const priorities = ['high', 'normal', 'low'] as const

export type Priority = typeof priorities[number]

export const priorityNames: Record<Priority, string> = {
  high: 'High',
  normal: 'Normal',
  low: 'Low',
}

export type Column = {
  status: TaskStatus
  name: string
  color: string
  hint: string
  skeletonCount: number
}

export type Member = {
  id: string
  name: string
  initials: string
  color: string
}

export type Label = {
  id: string
  name: string
}

export type Due = {
  date: string
  label: string
  tone?: 'soon' | 'overdue'
}

export type TimelineItem = {
  id: string
  kind: 'event' | 'comment'
  text: string
  when: string
}

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  position: number
  labels: Label[]
  assignees: Member[]
  due?: Due
  commentCount: number
}

export type TaskDraft = {
  title: string
  description: string | null
  priority: Priority
  dueDate: string | null
  status: TaskStatus
}
