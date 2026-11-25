/** @jest-environment jsdom */
import { CompressionStream, ReadableStream } from 'node:stream/web'
import { inflateSync } from 'node:zlib'
import {
  generateSettlementPng,
  settlementRasterSize,
} from './settlementImagePng'
import type { SettlementImageReport } from './settlementImageReport'

function reportWithExpenses(count: number): SettlementImageReport {
  return {
    title: 'Settlement #12',
    date: '2026-11-25',
    completed: true,
    members: [],
    transfers: [],
    wallet: null,
    expenses: Array.from({ length: count }, (_, index) => ({
      description: `Expense ${index + 1}`,
      amount: '120 TWD',
      date: '2026/11/24',
      category: 'Meals',
      payers: ['A 120 TWD'],
      splits: ['B 120 TWD'],
    })),
    t: (key) => key,
  }
}

it('retains normal resolution and scales longer reports within the canvas budget', () => {
  expect(settlementRasterSize(1000)).toEqual({ width: 896, height: 2000 })
  for (const logicalHeight of [12_000, 40_000, 100_000]) {
    const { width, height } = settlementRasterSize(logicalHeight)
    expect(width * height).toBeLessThanOrEqual(8_388_608)
    expect(height).toBeLessThanOrEqual(32_767)
    expect(width).toBeGreaterThan(0)
    expect(Math.abs(width - 448 * (height / logicalHeight))).toBeLessThan(1)
  }
})

it('paints all expense entries in order and encodes the report once', async () => {
  const fillText = jest.fn()
  const context = {
    fillText,
    measureText: (value: string) => ({ width: value.length * 6 }),
    scale: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    roundRect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
  }
  const blob = new Blob(['png'], { type: 'image/png' })
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
  const toBlob = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob')
  getContext.mockReturnValue(context as unknown as CanvasRenderingContext2D)
  toBlob.mockImplementation(function (this: HTMLCanvasElement, callback) {
    expect(this.height).toBeGreaterThan(3200)
    callback(blob)
  })
  const report = reportWithExpenses(80)
  try {
    await expect(
      generateSettlementPng(report, new AbortController().signal)
    ).resolves.toBe(blob)
    expect(toBlob).toHaveBeenCalledTimes(1)
    expect(
      fillText.mock.calls
        .map(([value]) => value)
        .filter((value) => /^Expense \d+$/.test(value))
    ).toEqual(report.expenses.map(({ description }) => description))
  } finally {
    getContext.mockRestore()
    toBlob.mockRestore()
  }
})

it('preserves the full report width and every expense in a single long PNG', async () => {
  const globals = {
    CompressionStream: globalThis.CompressionStream,
    ReadableStream: globalThis.ReadableStream,
  }
  Object.assign(globalThis, { CompressionStream, ReadableStream })
  let offset = 0
  const markedRows = new Map<number, number>()
  const getImageData = jest.fn(
    (_x: number, _y: number, width: number, rows: number) => {
      const canvas = getContext.mock.contexts[0] as HTMLCanvasElement
      expect(canvas.width * canvas.height).toBeLessThanOrEqual(8_388_608)
      const data = new Uint8ClampedArray(width * rows * 4)
      for (const [row, expense] of markedRows) {
        if (row < rows) {
          data[row * width * 4] = expense >> 8
          data[row * width * 4 + 1] = expense & 0xff
        }
      }
      return { data }
    }
  )
  const context = {
    measureText: (value: string) => ({ width: value.length * 6 }),
    scale: jest.fn(),
    setTransform: (
      _a: number,
      _b: number,
      _c: number,
      _d: number,
      _e: number,
      y: number
    ) => {
      offset = y
      markedRows.clear()
    },
    fillText: (value: string, _x: number, y: number) => {
      const match = /^Expense (\d+)$/.exec(value)
      const row = Math.floor(y + offset)
      if (match && row >= 0) markedRows.set(row, Number(match[1]))
    },
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    roundRect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    getImageData,
  }
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
  const toBlob = jest.spyOn(HTMLCanvasElement.prototype, 'toBlob')
  getContext.mockReturnValue(context as unknown as CanvasRenderingContext2D)

  try {
    const png = await generateSettlementPng(
      reportWithExpenses(500),
      new AbortController().signal
    )
    const bytes = await new Promise<Buffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(Buffer.from(reader.result as ArrayBuffer))
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(png)
    })
    expect(png.type).toBe('image/png')
    expect(bytes.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    )
    expect(bytes.toString('ascii', 12, 16)).toBe('IHDR')
    const width = bytes.readUInt32BE(16)
    const height = bytes.readUInt32BE(20)
    expect(width).toBe(448)
    expect(height).toBeGreaterThan(32_767)
    expect(toBlob).not.toHaveBeenCalled()
    expect(getImageData.mock.calls.length).toBeGreaterThan(1)

    const compressed: Buffer[] = []
    for (let start = 8; start < bytes.length; ) {
      const length = bytes.readUInt32BE(start)
      const type = bytes.toString('ascii', start + 4, start + 8)
      if (type === 'IDAT') {
        compressed.push(bytes.subarray(start + 8, start + 8 + length))
      }
      start += length + 12
    }
    const scanlines = inflateSync(Buffer.concat(compressed))
    const stride = width * 4 + 1
    expect(scanlines.length).toBe(height * stride)
    const expenses: number[] = []
    for (let row = 0; row < height; row += 1) {
      const expense = scanlines.readUInt16BE(row * stride + 1)
      if (expense) expenses.push(expense)
    }
    expect(expenses).toEqual(Array.from({ length: 500 }, (_, i) => i + 1))
  } finally {
    getContext.mockRestore()
    toBlob.mockRestore()
    Object.assign(globalThis, globals)
  }
})
