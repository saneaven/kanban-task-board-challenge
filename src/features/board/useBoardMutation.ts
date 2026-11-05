import { useState } from 'react'
import { hashKey, useMutation, useMutationState, useQueryClient, type QueryKey } from '@tanstack/react-query'

export type BoardOperation<T = unknown> = {
  queryKey: QueryKey
  request: () => Promise<void>
  update: (data: T[]) => T[]
  errorText: (data: T[]) => string
}

export function useOptimisticBoardData<T>(queryKey: QueryKey, data: T[]): T[] {
  const operations = useMutationState({
    filters: { mutationKey: ['board'], status: 'pending' },
    select: (mutation) => mutation.state.variables as BoardOperation,
  })
  const key = hashKey(queryKey)

  return operations
    .filter((operation) => hashKey(operation.queryKey) === key)
    .reduce((current, operation) => operation.update(current) as T[], data)
}

export function useBoardMutation() {
  const client = useQueryClient()
  const [failures, setFailures] = useState<BoardOperation[]>([])
  const failed = failures[0]
  const queryKey = failed?.queryKey ?? []
  const currentData = useOptimisticBoardData(queryKey, client.getQueryData<unknown[]>(queryKey) ?? [])
  const mutation = useMutation({
    mutationKey: ['board'],
    scope: { id: 'board' },
    networkMode: 'always',
    retry: false,
    mutationFn: (operation: BoardOperation) => operation.request(),
    onMutate: () => client.cancelQueries(),
    onSuccess: (_data, operation) => {
      client.setQueryData<unknown[]>(operation.queryKey, (current) => operation.update(current ?? []))
    },
    onError: (_error, operation) => setFailures((current) => [...current, operation]),
    onSettled: () => {
      if (client.isMutating({ mutationKey: ['board'] }) === 1) {
        void client.invalidateQueries()
      }
    },
  })

  function mutate<T>(operation: BoardOperation<T>) {
    mutation.mutate({
      ...operation,
      update: (data) => operation.update(data as T[]),
      errorText: (data) => operation.errorText(data as T[]),
    })
  }

  return {
    mutate,
    toast: failed ? {
      text: failed.errorText(currentData),
      retry: () => {
        setFailures((current) => current.slice(1))
        mutation.mutate(failed)
      },
      dismiss: () => setFailures((current) => current.slice(1)),
    } : null,
  }
}
