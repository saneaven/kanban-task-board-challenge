import { useQuery } from '@tanstack/react-query'
import { fetchLabels } from '../labels/api'
import { fetchTasks } from '../tasks/api'
import { dueStatus } from '../tasks/dueStatus'
import { fetchMembers } from '../team/api'
import { initials } from '../team/initials'
import type { Member, Priority, Task, TaskStatus } from './types'
import { useOptimisticBoardData } from './useBoardMutation'

export function useBoardData(enabled: boolean) {
  const options = { enabled, networkMode: 'always' as const, refetchOnReconnect: true, retry: false as const }
  const tasksQuery = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks, ...options })
  const membersQuery = useQuery({ queryKey: ['members'], queryFn: fetchMembers, ...options })
  const labelsQuery = useQuery({ queryKey: ['labels'], queryFn: fetchLabels, ...options })

  const taskRows = useOptimisticBoardData(['tasks'], tasksQuery.data ?? [])
  const memberRows = useOptimisticBoardData(['members'], membersQuery.data ?? [])
  const labelRows = useOptimisticBoardData(['labels'], labelsQuery.data ?? [])
  const hasData = tasksQuery.data !== undefined && membersQuery.data !== undefined && labelsQuery.data !== undefined

  const members: Member[] = hasData ? memberRows.map((member) => ({
    id: member.id,
    name: member.name,
    initials: initials(member.name),
    color: `var(--color-${member.color ?? 'surface'})`,
  })) : []
  const labels = hasData ? labelRows : []
  const tasks: Task[] = hasData ? taskRows.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as TaskStatus,
    priority: task.priority as Priority,
    position: task.position,
    labels: labels.filter((label) => task.task_labels.some((tag) => tag.label_id === label.id)),
    assignees: members.filter((member) => task.task_assignees.some((assignee) => assignee.member_id === member.id)),
    due: dueStatus(task.due_date, task.status as TaskStatus),
    commentCount: task.comments[0].count,
  })).sort((left, right) => left.position - right.position) : []

  function retry() {
    if (tasksQuery.isError) void tasksQuery.refetch()
    if (membersQuery.isError) void membersQuery.refetch()
    if (labelsQuery.isError) void labelsQuery.refetch()
  }

  return {
    tasks,
    members,
    labels,
    hasData,
    isError: tasksQuery.isError || membersQuery.isError || labelsQuery.isError,
    retry,
  }
}
