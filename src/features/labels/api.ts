import { supabase } from '../../lib/supabase'
import type { Label } from '../board/types'

export async function fetchLabels() {
  const { data, error } = await supabase
    .from('labels')
    .select('id, name')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createLabel(label: Label): Promise<void> {
  const { error } = await supabase.from('labels').insert(label)
  if (error) throw error
}

export async function setTaskLabel(taskId: string, labelId: string, assigned: boolean): Promise<void> {
  const query = assigned
    ? supabase.from('task_labels').upsert({ task_id: taskId, label_id: labelId }, { onConflict: 'task_id,label_id', ignoreDuplicates: true })
    : supabase.from('task_labels').delete().eq('task_id', taskId).eq('label_id', labelId)
  const { error } = await query
  if (error) throw error
}
