import { supabase } from '../../lib/supabase'

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_assignees(member_id), task_labels(label_id), comments(count)')
    .order('position', { ascending: true })

  if (error) throw error
  return data
}
