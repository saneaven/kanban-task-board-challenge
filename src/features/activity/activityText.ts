import type { Database } from '../../lib/database.types'
import { columnsByStatus } from '../board/columns'
import { priorityNames, type Priority, type TaskStatus } from '../board/types'

type Activity = Pick<Database['public']['Tables']['task_activity']['Row'], 'action' | 'details'>
type Action = 'created' | 'status_changed' | 'edited' | 'assigned' | 'unassigned' | 'labeled' | 'unlabeled'
type EditedField = 'title' | 'description' | 'priority' | 'due_date'

export function activityText(activity: Activity): string[] {
  const action = activity.action as Action

  switch (action) {
    case 'created': {
      const details = activity.details as { status: TaskStatus }
      return [`Created in ${columnsByStatus[details.status].name}`]
    }
    case 'status_changed': {
      const details = activity.details as { from: TaskStatus; to: TaskStatus }
      return [`Moved from ${columnsByStatus[details.from].name} → ${columnsByStatus[details.to].name}`]
    }
    case 'edited': {
      const details = activity.details as { fields: EditedField[]; priority: Priority; due_date: string | null }
      const text = {
        title: 'Title changed',
        description: 'Description changed',
        priority: `Priority changed to ${priorityNames[details.priority]}`,
        due_date: details.due_date === null ? 'Due date removed' : 'Due date changed',
      }
      return details.fields.map((field) => text[field])
    }
    case 'assigned':
    case 'unassigned': {
      const details = activity.details as { member_name: string }
      return [`${action === 'assigned' ? 'Assigned' : 'Unassigned'} ${details.member_name}`]
    }
    case 'labeled':
    case 'unlabeled': {
      const details = activity.details as { label_name: string }
      return [`${action === 'labeled' ? 'Added' : 'Removed'} label ${details.label_name}`]
    }
  }
}
