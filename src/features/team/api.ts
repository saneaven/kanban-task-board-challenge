import { supabase } from '../../lib/supabase'

export async function fetchMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, color')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}
