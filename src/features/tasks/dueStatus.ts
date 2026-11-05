import type { Due, TaskStatus } from '../board/types'

export function dueStatus(dueDate: string | null, status: TaskStatus, now = new Date()): Due | undefined {
  if (!dueDate) return undefined

  const [year, month, day] = dueDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((date.getTime() - today.getTime()) / 86400000)
  const done = status === 'done'
  const overdue = !done && days < 0
  const soon = !done && days >= 0 && days <= 2

  let label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (overdue) label = `Overdue ${Math.abs(days)}d`
  else if (!done && days === 0) label = 'Due today'
  else if (!done && days === 1) label = 'Due tomorrow'

  return { date: dueDate, label, tone: overdue ? 'overdue' : soon ? 'soon' : undefined }
}
