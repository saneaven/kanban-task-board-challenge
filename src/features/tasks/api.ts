import { supabase } from '../../lib/supabase'
import type { TaskStatus } from '../board/types'

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_assignees(member_id), task_labels(label_id), comments(count)')
    .order('position', { ascending: true })

  if (error) throw error
  return data
}

export type TaskRow = Omit<Awaited<ReturnType<typeof fetchTasks>>[number], 'user_id' | 'created_at'>

export type NewTask = Pick<TaskRow, 'id' | 'title' | 'description' | 'priority' | 'due_date' | 'status' | 'position'>

export async function createTask(task: NewTask): Promise<void> {
  const { error } = await supabase.from('tasks').insert(task).select('id').single()
  if (error) throw error
}

export async function moveTask(id: string, status: TaskStatus, position: number): Promise<void> {
  const { error } = await supabase.from('tasks').update({ status, position }).eq('id', id).select('id').single()
  if (error) throw error
}
