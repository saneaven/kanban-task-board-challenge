import { describe, expect, it } from 'vitest'
import type { Task } from './types'
import { matches } from './useBoardFilters'

const task: Task = {
  id: 'task-1',
  title: 'Fix controller reconnect',
  description: 'A description that does not match the title',
  status: 'todo',
  priority: 'high',
  position: 1,
  labels: [{ id: 'bug', name: 'Bug' }],
  assignees: [{ id: 'mina', name: 'Mina Park', initials: 'MP', color: 'var(--color-avatar-1)' }],
  commentCount: 0,
}

const filters = { query: '', label: null, priority: null, member: null }

describe('matches', () => {
  it('keeps every task without active filters', () => {
    expect(matches(task, filters)).toBe(true)
    expect(matches(task, { ...filters, query: '   ' })).toBe(true)
  })

  it('searches only the title, ignoring case and surrounding whitespace', () => {
    expect(matches(task, { ...filters, query: '  CONTROLLER  ' })).toBe(true)
    expect(matches(task, { ...filters, query: 'description' })).toBe(false)
  })

  it('requires every selected filter to match', () => {
    const selected = { query: 'reconnect', label: 'bug', priority: 'high' as const, member: 'mina' }
    expect(matches(task, selected)).toBe(true)
    expect(matches(task, { ...selected, label: 'feature' })).toBe(false)
    expect(matches(task, { ...selected, priority: 'low' })).toBe(false)
    expect(matches(task, { ...selected, member: 'theo' })).toBe(false)
    expect(matches(task, { ...selected, query: 'inventory' })).toBe(false)
  })

  it('matches label and member ids rather than display names', () => {
    expect(matches(task, { ...filters, label: 'Bug' })).toBe(false)
    expect(matches(task, { ...filters, member: 'Mina Park' })).toBe(false)
  })

  it('excludes unassigned and unlabelled tasks only when those filters are active', () => {
    const unassigned = { ...task, labels: [], assignees: [] }
    expect(matches(unassigned, filters)).toBe(true)
    expect(matches(unassigned, { ...filters, label: 'bug' })).toBe(false)
    expect(matches(unassigned, { ...filters, member: 'mina' })).toBe(false)
  })
})
