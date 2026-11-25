/** @jest-environment jsdom */
import { act, renderHook, waitFor } from '@testing-library/react'
import type { Transaction } from '@/entities/transaction'
import { useSettlementRecordTransactions } from './useSettlementRecordTransactions'

it('exposes a failed query and marks a successful empty retry as ready', async () => {
  const repo = {
    findBySettlementRecordId: jest
      .fn()
      .mockRejectedValueOnce(new Error('read failed'))
      .mockResolvedValueOnce([]),
  }
  const { result } = renderHook(() =>
    useSettlementRecordTransactions('A', repo)
  )
  expect(result.current.status).toBe('loading')
  await waitFor(() => expect(result.current.status).toBe('error'))
  expect(result.current.error).toBe('read failed')

  await act(async () => {
    await result.current.loadTransactions('A')
  })
  expect(result.current.status).toBe('ready')
  expect(result.current.transactions).toEqual([])
  expect(result.current.error).toBeNull()
})

it('ignores results from earlier requests, even when returning to the same record', async () => {
  const pending: ((value: Transaction[]) => void)[] = []
  const repo = {
    findBySettlementRecordId: jest.fn(
      () => new Promise<Transaction[]>((resolve) => pending.push(resolve))
    ),
  }
  const { result, rerender } = renderHook(
    ({ id }) => useSettlementRecordTransactions(id, repo),
    { initialProps: { id: 'A' } }
  )
  rerender({ id: 'B' })
  rerender({ id: 'A' })

  await act(async () => pending[0]([]))
  await act(async () => pending[1]([]))
  expect(result.current.status).toBe('loading')

  await act(async () => pending[2]([]))
  expect(result.current.status).toBe('ready')
})
