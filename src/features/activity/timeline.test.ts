import { describe, expect, it } from 'vitest'
import { mergeTimeline } from './timeline'

describe('mergeTimeline', () => {
  it('merges events and comments chronologically with independent identities', () => {
    const entries = mergeTimeline([
      { id: 'same', action: 'edited', details: { fields: ['title', 'description'], priority: 'normal', due_date: null }, created_at: '2026-11-04T12:00:00Z' },
      { id: 'created', action: 'created', details: { status: 'todo' }, created_at: '2026-11-04T10:00:00Z' },
    ], [
      { id: 'same', body: 'Repeated comment', created_at: '2026-11-04T11:00:00Z' },
      { id: 'another', body: 'Repeated comment', created_at: '2026-11-04T13:00:00Z' },
    ])

    expect(entries.map((entry) => entry.text)).toEqual([
      'Created in To Do', 'Repeated comment', 'Title changed', 'Description changed', 'Repeated comment',
    ])
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(5)
  })
})
