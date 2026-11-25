/** @jest-environment jsdom */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ButtonProps, ModalProps } from '@heroui/react'
import { generateSettlementPng } from '@/utils/settlementImagePng'
import type { SettlementRecordExportData } from '@/utils/settlementMarkdown'
import SettlementImageModal from './SettlementImageModal'

jest.mock('@/utils/settlementImagePng', () => ({
  generateSettlementPng: jest.fn(),
}))

jest.mock('@heroui/react', () => {
  const hero = jest.requireActual('@heroui/react')
  return {
    ...hero,
    Modal: (props: ModalProps) => <hero.Modal {...props} disableAnimation />,
    Button: (props: ButtonProps) => <hero.Button {...props} disableRipple />,
  }
})

const generate = jest.mocked(generateSettlementPng)
const share = jest.fn<Promise<void>, [ShareData]>()
const canShare = jest.fn<boolean, [ShareData]>()
const createObjectURL = jest.fn()
const revokeObjectURL = jest.fn()
const source: Omit<SettlementRecordExportData, 'transactions'> = {
  sequenceNumber: 12,
  record: {
    id: 'record',
    accountBookId: 'book',
    memberStatuses: [],
    transfers: [],
    createdAt: 0,
    updatedAt: 0,
  },
  currency: null,
  userMap: new Map(),
  categoryMap: new Map(),
  t: (key) => key,
}
const modalProps = {
  source,
  transactions: [],
  onRetryTransactions: jest.fn(),
  onClose: jest.fn(),
}

beforeEach(() => {
  generate.mockReset()
  createObjectURL.mockReset()
  revokeObjectURL.mockReset()
  share.mockReset().mockResolvedValue(undefined)
  canShare.mockReset().mockReturnValue(true)
  Object.defineProperties(navigator, {
    share: { configurable: true, value: share },
    canShare: { configurable: true, value: canShare },
  })
  URL.createObjectURL = createObjectURL
  URL.revokeObjectURL = revokeObjectURL
})

afterEach(() => {
  Reflect.deleteProperty(navigator, 'share')
  Reflect.deleteProperty(navigator, 'canShare')
  jest.restoreAllMocks()
})

it('shares the same single PNG that is shown in the preview', async () => {
  generate.mockResolvedValue(new Blob(['one image']))
  createObjectURL.mockReturnValueOnce('blob:report')
  const { unmount } = render(
    <SettlementImageModal {...modalProps} transactionStatus="ready" />
  )
  const action = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Share image',
  })
  expect(action.disabled).toBe(true)
  expect(generate).toHaveBeenCalledTimes(1)
  expect((await screen.findByRole('img')).getAttribute('src')).toBe(
    'blob:report'
  )
  fireEvent.click(action)
  expect(share).toHaveBeenCalledTimes(1)
  const files = share.mock.calls[0][0].files
  expect(files).toHaveLength(1)
  expect(files?.[0]).toBe(createObjectURL.mock.calls[0][0])
  expect(files?.[0]).toMatchObject({
    name: 'settlement-12.png',
    type: 'image/png',
  })
  expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull()
  await waitFor(() => expect(action.disabled).toBe(false))
  unmount()
  expect(revokeObjectURL.mock.calls).toEqual([['blob:report']])
})

it('waits for the current expenses and distinguishes a failed load from a loaded empty report', async () => {
  generate.mockResolvedValue(new Blob(['empty report']))
  createObjectURL.mockReturnValue('blob:empty')
  const { rerender } = render(
    <SettlementImageModal {...modalProps} transactionStatus="loading" />
  )
  const action = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Share image',
  })
  expect(screen.getByRole('status').textContent).toContain(
    'Loading settlement expenses'
  )
  expect(action.disabled).toBe(true)
  expect(generate).not.toHaveBeenCalled()

  rerender(<SettlementImageModal {...modalProps} transactionStatus="error" />)
  expect(screen.getByRole('alert').textContent).toBe(
    'Could not load settlement expenses.'
  )
  expect(action.disabled).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  expect(modalProps.onRetryTransactions).toHaveBeenCalledTimes(1)
  expect(generate).not.toHaveBeenCalled()

  rerender(<SettlementImageModal {...modalProps} transactionStatus="ready" />)
  await screen.findByRole('img')
  expect(generate.mock.calls[0][0].expenses).toEqual([])
  expect(action.disabled).toBe(false)
})

it('retries a generation error without rebuilding the source snapshot', async () => {
  generate
    .mockRejectedValueOnce(new Error('PNG encoding failed'))
    .mockResolvedValueOnce(new Blob(['image']))
  createObjectURL.mockReturnValue('blob:retry')
  render(<SettlementImageModal {...modalProps} transactionStatus="ready" />)

  expect((await screen.findByRole('alert')).textContent).toContain(
    'Could not generate the image'
  )
  expect(
    screen.getByRole<HTMLButtonElement>('button', { name: 'Share image' })
      .disabled
  ).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
  await screen.findByRole('img')
  expect(generate).toHaveBeenCalledTimes(2)
  expect(generate.mock.calls[1][0]).toBe(generate.mock.calls[0][0])
})

it('discards a result that arrives after the preview unmounts', async () => {
  let resolve!: (value: Blob) => void
  generate.mockImplementation(
    () =>
      new Promise((complete) => {
        resolve = complete
      })
  )
  const { unmount } = render(
    <SettlementImageModal {...modalProps} transactionStatus="ready" />
  )
  const signal = generate.mock.calls[0][1]
  unmount()
  expect(signal.aborted).toBe(true)
  await act(async () => resolve(new Blob(['stale'])))
  expect(createObjectURL).not.toHaveBeenCalled()
})

it('shares the named draft and keeps the preview available after cancelling or failing', async () => {
  generate.mockResolvedValue(new Blob(['draft image']))
  createObjectURL.mockReturnValue('blob:draft')
  share
    .mockRejectedValueOnce(new DOMException('Cancelled', 'AbortError'))
    .mockRejectedValueOnce(new DOMException('Share target failed', 'DataError'))
  const onClose = jest.fn()
  render(
    <SettlementImageModal
      {...modalProps}
      source={{
        exportedAt: new Date(),
        memberStatuses: [],
        transfers: [],
        sharedWalletSummary: null,
        currency: null,
        userMap: new Map(),
        categoryMap: new Map(),
        t: (key) => key,
      }}
      transactionStatus="ready"
      onClose={onClose}
    />
  )
  const image = await screen.findByRole('img')
  expect(image.getAttribute('alt')).toBe('Settlement draft export preview')
  const action = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Share image',
  })
  fireEvent.click(action)
  expect(share.mock.calls[0][0].files?.[0].name).toBe('settlement-draft.png')
  await waitFor(() => expect(action.disabled).toBe(false))
  expect(screen.queryByRole('alert')).toBeNull()

  fireEvent.click(action)
  expect((await screen.findByRole('alert')).textContent).toBe(
    'Could not share the image. Please try again.'
  )
  expect(image.getAttribute('src')).toBe('blob:draft')
  await waitFor(() => expect(action.disabled).toBe(false))
  fireEvent.click(action)
  await waitFor(() => expect(share).toHaveBeenCalledTimes(3))
  expect(screen.queryByRole('alert')).toBeNull()
  await waitFor(() => expect(action.disabled).toBe(false))
  fireEvent.click(screen.getAllByRole('button', { name: 'Close' }).at(-1)!)
  expect(onClose).toHaveBeenCalledTimes(1)
})

it.each(['no share API', 'file sharing unavailable'])(
  'shows a preview with sharing disabled when %s',
  async (reason) => {
    if (reason === 'no share API') Reflect.deleteProperty(navigator, 'share')
    else canShare.mockReturnValue(false)
    generate.mockResolvedValue(new Blob(['image']))
    createObjectURL.mockReturnValue('blob:report')
    render(<SettlementImageModal {...modalProps} transactionStatus="ready" />)

    expect((await screen.findByRole('img')).getAttribute('src')).toBe(
      'blob:report'
    )
    expect(screen.getByRole('status').textContent).toBe(
      'This browser cannot share image files.'
    )
    expect(
      screen.getByRole<HTMLButtonElement>('button', { name: 'Share image' })
        .disabled
    ).toBe(true)
    expect(share).not.toHaveBeenCalled()
  }
)
