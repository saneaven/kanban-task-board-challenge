import { useState } from 'react'
import type { Priority, Task } from './types'

type BoardFilters = {
  query: string
  label: string | null
  priority: Priority | null
  member: string | null
}

export function matches(task: Task, filters: BoardFilters): boolean {
  const query = filters.query.trim().toLowerCase()

  return (!query || task.title.toLowerCase().includes(query))
    && (!filters.label || task.labels.some((label) => label.id === filters.label))
    && (!filters.priority || task.priority === filters.priority)
    && (!filters.member || task.assignees.some((member) => member.id === filters.member))
}

export function useBoardFilters(tasks: Task[]) {
  const [query, setQuery] = useState('')
  const [label, setLabel] = useState<string | null>(null)
  const [priority, setPriority] = useState<Priority | null>(null)
  const [member, setMember] = useState<string | null>(null)

  const filters = { query, label, priority, member }
  const filteredTasks = tasks.filter((task) => matches(task, filters))
  const filtering = !!(query.trim() || label || priority || member)

  function clearFilters() {
    setQuery('')
    setLabel(null)
    setPriority(null)
    setMember(null)
  }

  return {
    query,
    setQuery,
    label,
    toggleLabel: (id: string) => setLabel((current) => current === id ? null : id),
    priority,
    togglePriority: (value: Priority) => setPriority((current) => current === value ? null : value),
    member,
    toggleMember: (id: string) => setMember((current) => current === id ? null : id),
    filteredTasks,
    filtering,
    matchText: `${filteredTasks.length} of ${tasks.length} tasks`,
    clearFilters,
  }
}
