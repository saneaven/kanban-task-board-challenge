import type { Database } from '../../lib/database.types'
import { activityText } from './activityText'

export type TimelineEntry = {
  id: string
  kind: 'event' | 'comment'
  text: string
  createdAt: string
}

type Activity = Pick<Database['public']['Tables']['task_activity']['Row'], 'id' | 'action' | 'details' | 'created_at'>
type Comment = Pick<Database['public']['Tables']['comments']['Row'], 'id' | 'body' | 'created_at'>

export function commentEntryId(id: string): string {
  return `comment:${id}`
}

export function mergeTimeline(activity: Activity[], comments: Comment[]): TimelineEntry[] {
  return [
    ...activity.flatMap((entry) => activityText(entry).map((text, index): TimelineEntry => ({
      id: `activity:${entry.id}:${index}`,
      kind: 'event',
      text,
      createdAt: entry.created_at,
    }))),
    ...comments.map((comment): TimelineEntry => ({
      id: commentEntryId(comment.id),
      kind: 'comment',
      text: comment.body,
      createdAt: comment.created_at,
    })),
  ].sort((left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime())
}
