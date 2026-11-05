import { supabase } from '../../lib/supabase'

export async function fetchMembers() {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, color')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export type MemberRow = Awaited<ReturnType<typeof fetchMembers>>[number]

export async function createMember(member: MemberRow): Promise<void> {
  const { error } = await supabase.from('team_members').insert(member)
  if (error) throw error
}

export async function setAssignee(taskId: string, memberId: string, assigned: boolean): Promise<void> {
  const query = assigned
    ? supabase.from('task_assignees').upsert({ task_id: taskId, member_id: memberId }, { onConflict: 'task_id,member_id', ignoreDuplicates: true })
    : supabase.from('task_assignees').delete().eq('task_id', taskId).eq('member_id', memberId)
  const { error } = await query
  if (error) throw error
}
