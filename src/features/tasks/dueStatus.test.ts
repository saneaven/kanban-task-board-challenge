import { afterEach, describe, expect, it, vi } from 'vitest'
import { dueStatus } from './dueStatus'

afterEach(() => vi.unstubAllEnvs())

describe('dueStatus', () => {
  const now = new Date(2026, 10, 4, 15, 30)

  it('omits tasks with no due date', () => {
    expect(dueStatus(null, 'todo', now)).toBeUndefined()
  })

  it.each([
    ['2026-11-02', 'Overdue 2d', 'overdue'],
    ['2026-11-03', 'Overdue 1d', 'overdue'],
    ['2026-11-04', 'Due today', 'soon'],
    ['2026-11-05', 'Due tomorrow', 'soon'],
    ['2026-11-06', 'Nov 6', 'soon'],
    ['2026-11-07', 'Nov 7', undefined],
  ])('labels %s as %s', (date, label, tone) => {
    expect(dueStatus(date, 'in_progress', now)).toEqual({ date, label, tone })
  })

  it.each(['2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'])('excludes done tasks from urgency for %s', (date) => {
    const due = dueStatus(date, 'done', now)
    expect(due?.tone).toBeUndefined()
    expect(due?.label).toMatch(/^Nov /)
  })

  it('parses calendar dates locally', () => {
    vi.stubEnv('TZ', 'America/Los_Angeles')
    expect(dueStatus('2026-11-07', 'todo', new Date(2026, 10, 4, 23, 50))).toEqual({
      date: '2026-11-07',
      label: 'Nov 7',
      tone: undefined,
    })
  })

  it('counts calendar days across daylight-saving transitions', () => {
    vi.stubEnv('TZ', 'America/Los_Angeles')
    expect(dueStatus('2026-03-09', 'todo', new Date(2026, 2, 7, 16))).toEqual({
      date: '2026-03-09',
      label: 'Mar 9',
      tone: 'soon',
    })
    expect(dueStatus('2026-11-02', 'todo', new Date(2026, 9, 31, 16))).toEqual({
      date: '2026-11-02',
      label: 'Nov 2',
      tone: 'soon',
    })
  })
})
