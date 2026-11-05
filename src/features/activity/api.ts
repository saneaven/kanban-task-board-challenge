import { supabase } from '../../lib/supabase'

export async function fetchActivity(taskId: string) {
  const { data, error } = await supabase
    .from('task_activity')
    .select('id, action, details, created_at')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
