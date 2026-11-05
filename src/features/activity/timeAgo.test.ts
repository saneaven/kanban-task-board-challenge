import { describe, expect, it } from 'vitest'
import { timeAgo } from './timeAgo'

describe('timeAgo', () => {
  const now = new Date('2026-11-04T12:00:00Z')

  it.each([
    [0, 'just now'],
    [59, 'just now'],
    [60, '1 min ago'],
    [3599, '59 min ago'],
    [3600, '1 hour ago'],
    [5340, '1 hour ago'],
    [5400, '2 hours ago'],
    [84540, '23 hours ago'],
    [84600, '1 day ago'],
    [86400, '1 day ago'],
    [129600, '2 days ago'],
    [259200, '3 days ago'],
  ])('formats %i elapsed seconds as %s', (seconds, expected) => {
    const timestamp = new Date(now.getTime() - seconds * 1000).toISOString()
    expect(timeAgo(timestamp, now)).toBe(expected)
  })
})
