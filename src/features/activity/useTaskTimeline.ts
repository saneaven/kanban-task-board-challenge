import { useQuery } from '@tanstack/react-query'
import { useOptimisticBoardData } from '../board/useBoardMutation'
import { fetchComments } from '../comments/api'
import { fetchActivity } from './api'
import { mergeTimeline } from './timeline'
import { timeAgo } from './timeAgo'

export function useTaskTimeline(taskId: string) {
  const queryKey = ['timeline', taskId]
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const [activity, comments] = await Promise.all([fetchActivity(taskId), fetchComments(taskId)])
      return mergeTimeline(activity, comments)
    },
    networkMode: 'always',
    refetchOnReconnect: true,
    retry: false,
  })
  const entries = useOptimisticBoardData(queryKey, query.data ?? [])

  return {
    items: entries.map((entry) => ({ ...entry, when: timeAgo(entry.createdAt) })),
    isError: query.isError,
    retry: () => { void query.refetch() },
  }
}
