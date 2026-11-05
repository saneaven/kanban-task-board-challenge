import { useState } from 'react'
import { useMutation, useMutationState, useQueryClient, type QueryKey } from '@tanstack/react-query'

export type BoardOperation<T> = {
  request: () => Promise<void>
  update: (data: T) => T
  errorText: (data: T) => string
}

export function useOptimisticBoardData<T>(queryKey: QueryKey, data: T): T {
  const operations = useMutationState({
    filters: { mutationKey: ['board', ...queryKey], status: 'pending' },
    select: (mutation) => mutation.state.variables as BoardOperation<T>,
  })

  return operations.reduce((current, operation) => current === undefined ? current : operation.update(current), data)
}

export function useBoardMutation<T>(queryKey: QueryKey) {
  const client = useQueryClient()
  const currentData = useOptimisticBoardData(queryKey, client.getQueryData<T>(queryKey))
  const [failed, setFailed] = useState<BoardOperation<T> | null>(null)
  const mutation = useMutation({
    mutationKey: ['board', ...queryKey],
    scope: { id: 'board' },
    networkMode: 'always',
    retry: false,
    mutationFn: (operation: BoardOperation<T>) => operation.request(),
    onMutate: () => client.cancelQueries(),
    onSuccess: (_data, operation) => {
      client.setQueryData<T>(queryKey, (current) => current === undefined ? current : operation.update(current))
    },
    onError: (_error, operation) => setFailed((current) => current ?? operation),
    onSettled: () => {
      if (client.isMutating({ mutationKey: ['board'] }) === 1) {
        void client.invalidateQueries()
      }
    },
  })

  return {
    mutate: mutation.mutate,
    toast: failed && currentData !== undefined ? {
      text: failed.errorText(currentData),
      retry: () => {
        setFailed(null)
        mutation.mutate(failed)
      },
      dismiss: () => setFailed(null),
    } : null,
  }
}
