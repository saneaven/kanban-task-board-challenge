import { supabase } from '../../lib/supabase'

export async function fetchComments(taskId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, body, created_at')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createComment(id: string, taskId: string, body: string): Promise<void> {
  const { error } = await supabase.from('comments').insert({ id, task_id: taskId, body })
  if (error) throw error
}
