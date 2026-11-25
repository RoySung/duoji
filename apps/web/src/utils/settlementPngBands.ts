const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
const crcTable = Uint32Array.from({ length: 256 }, (_, entry) => {
  let crc = entry
  for (let bit = 0; bit < 8; bit += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1
  }
  return crc
})

function chunk(type: string, data: Uint8Array = new Uint8Array(0)) {
  const bytes = new Uint8Array(data.length + 12)
  const view = new DataView(bytes.buffer)
  view.setUint32(0, data.length)
  for (let index = 0; index < 4; index += 1) {
    bytes[4 + index] = type.charCodeAt(index)
  }
  bytes.set(data, 8)

  let crc = 0xffffffff
  for (let index = 4; index < bytes.length - 4; index += 1) {
    crc = crcTable[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8)
  }
  view.setUint32(bytes.length - 4, crc ^ 0xffffffff)
  return bytes
}

function checkAborted(signal: AbortSignal) {
  if (signal.aborted) {
    throw new DOMException('Image generation cancelled', 'AbortError')
  }
}

export async function encodeSettlementPngBands(
  width: number,
  height: number,
  bandHeight: number,
  readBand: (top: number, rows: number) => Uint8ClampedArray,
  signal: AbortSignal
) {
  const header = new Uint8Array(13)
  const view = new DataView(header.buffer)
  view.setUint32(0, width)
  view.setUint32(4, height)
  header[8] = 8
  header[9] = 6 // RGBA

  const rowBytes = width * 4
  let top = 0
  const scanlines = new ReadableStream<Uint8Array>({
    async pull(controller) {
      // Let the browser process close and navigation events during a long render.
      if (top > 0) await new Promise((resolve) => setTimeout(resolve, 0))
      checkAborted(signal)
      const rows = Math.min(bandHeight, height - top)
      const rgba = readBand(top, rows)
      const bytes = new Uint8Array(rows * (rowBytes + 1))
      for (let row = 0; row < rows; row += 1) {
        const start = row * rowBytes
        // Each scanline starts with the PNG filter byte (0 for unfiltered).
        bytes.set(
          rgba.subarray(start, start + rowBytes),
          row * (rowBytes + 1) + 1
        )
      }
      controller.enqueue(bytes)
      top += rows
      if (top === height) controller.close()
    },
  })

  // IDAT chunks carry consecutive parts of one zlib stream.
  const compressed = scanlines.pipeThrough(new CompressionStream('deflate'))
  const reader = compressed.getReader()
  const parts: BlobPart[] = [pngSignature, chunk('IHDR', header)]
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      parts.push(chunk('IDAT', value))
    }
    checkAborted(signal)
    parts.push(chunk('IEND'))
    return new Blob(parts, { type: 'image/png' })
  } finally {
    reader.releaseLock()
  }
}
