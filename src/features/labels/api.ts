import { supabase } from '../../lib/supabase'

export async function fetchLabels() {
  const { data, error } = await supabase
    .from('labels')
    .select('id, name, color')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
