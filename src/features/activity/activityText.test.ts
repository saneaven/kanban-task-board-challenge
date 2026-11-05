import { describe, expect, it } from 'vitest'
import { activityText } from './activityText'

function edited(fields: string[], priority = 'normal', dueDate: string | null = null) {
  return { action: 'edited', details: { fields, priority, due_date: dueDate } }
}

describe('activityText', () => {
  it.each([
    ['todo', 'To Do'],
    ['in_progress', 'In Progress'],
    ['in_review', 'In Review'],
    ['done', 'Done'],
  ])('names the creation column %s', (status, name) => {
    expect(activityText({ action: 'created', details: { status } })).toEqual([`Created in ${name}`])
  })

  it('names both columns in a status change', () => {
    expect(activityText({ action: 'status_changed', details: { from: 'in_review', to: 'done' } }))
      .toEqual(['Moved from In Review → Done'])
  })

  it.each([['high', 'High'], ['normal', 'Normal'], ['low', 'Low']])('displays priority %s', (priority, name) => {
    expect(activityText(edited(['priority'], priority))).toEqual([`Priority changed to ${name}`])
  })

  it('distinguishes changing a due date from removing it', () => {
    expect(activityText(edited(['due_date'], 'normal', '2026-11-07'))).toEqual(['Due date changed'])
    expect(activityText(edited(['due_date']))).toEqual(['Due date removed'])
  })

  it.each([['title', 'Title changed'], ['description', 'Description changed']])('describes an edit to %s', (field, text) => {
    expect(activityText(edited([field]))).toEqual([text])
  })

  it('preserves every changed field in one activity row', () => {
    expect(activityText(edited(['title', 'description', 'priority', 'due_date'], 'high', '2026-11-07')))
      .toEqual(['Title changed', 'Description changed', 'Priority changed to High', 'Due date changed'])
  })

  it.each([['assigned', 'Assigned Mina Park'], ['unassigned', 'Unassigned Mina Park']])('uses the stored member name for %s', (action, text) => {
    expect(activityText({ action, details: { member_id: 'removed-member', member_name: 'Mina Park' } })).toEqual([text])
  })

  it.each([['labeled', 'Added label Feature'], ['unlabeled', 'Removed label Feature']])('uses the stored label name for %s', (action, text) => {
    expect(activityText({ action, details: { label_id: 'removed-label', label_name: 'Feature' } })).toEqual([text])
  })
})
