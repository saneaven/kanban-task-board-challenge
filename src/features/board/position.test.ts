import { describe, expect, it } from 'vitest'
import { positionBetween, positionForDrop } from './position'
import type { Task } from './types'

describe('positionBetween', () => {
  it('uses the midpoint between neighboring positions', () => {
    expect(positionBetween(2, 6)).toBe(4)
    expect(positionBetween(1, 2)).toBe(1.5)
  })

  it('subtracts one before the first card and adds one after the last', () => {
    expect(positionBetween(null, 4)).toBe(3)
    expect(positionBetween(4, null)).toBe(5)
  })

  it('starts an empty column at zero', () => {
    expect(positionBetween(null, null)).toBe(0)
  })
})

describe('positionForDrop', () => {
  const task = (id: string, position: number): Task => ({
    id,
    position,
    status: 'todo',
    title: id,
    description: null,
    priority: 'normal',
    labels: [],
    assignees: [],
    commentCount: 0,
  })
  const tasks = [task('first', 1), task('hidden', 2), task('anchor', 3), task('last', 4)]

  it('inserts before the visible anchor using its unfiltered predecessor', () => {
    expect(positionForDrop(tasks, task('moving', 0), 'todo', 'anchor')).toBe(2.5)
  })

  it('excludes the moving card before looking up its neighbors', () => {
    expect(positionForDrop(tasks, tasks[1], 'todo', 'anchor')).toBe(2)
  })

  it('appends after the full column when there is no visible anchor', () => {
    expect(positionForDrop(tasks, task('moving', 0), 'todo', null)).toBe(5)
  })

  it('keeps its position between unevenly spaced neighbors', () => {
    const uneven = [task('first', 1), task('middle', 2), task('last', 5)]
    expect(positionForDrop(uneven, uneven[1], 'todo', 'last')).toBe(2)
  })

  it('keeps its existing position at either end of the column', () => {
    const uneven = [task('first', 7), task('middle', 10), task('last', 20)]
    expect(positionForDrop(uneven, uneven[0], 'todo', 'middle')).toBe(7)
    expect(positionForDrop(uneven, uneven[2], 'todo', null)).toBe(20)
  })

  it('moves when a filtered drop crosses a hidden card', () => {
    const filtered = [task('moving', 1), task('hidden', 2), task('anchor', 5)]
    expect(positionForDrop(filtered, filtered[0], 'todo', 'anchor')).toBe(3.5)
  })

  it('starts an empty destination independently of other columns', () => {
    expect(positionForDrop(tasks, task('moving', 0), 'done', null)).toBe(0)
  })
})
