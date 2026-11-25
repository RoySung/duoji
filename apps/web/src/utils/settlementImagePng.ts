import {
  layoutSettlementImage,
  paintSettlementImage,
  reportWidth,
  resolveSettlementFont,
  settlementImageHeight,
} from './settlementImageLayout'
import type { SettlementImageReport } from './settlementImageReport'
import { encodeSettlementPngBands } from './settlementPngBands'

const maxCanvasPixels = 8_388_608
const maxCanvasSide = 32_767
const preferredScale = 2
const bandHeight = 1024

export function settlementRasterSize(logicalHeight: number) {
  const scale = Math.min(
    preferredScale,
    maxCanvasSide / logicalHeight,
    Math.sqrt(maxCanvasPixels / (reportWidth * logicalHeight))
  )
  return {
    width: Math.floor(reportWidth * scale),
    height: Math.floor(logicalHeight * scale),
  }
}

export async function generateSettlementPng(
  report: SettlementImageReport,
  signal: AbortSignal
) {
  const family = await resolveSettlementFont()
  if (signal.aborted)
    throw new DOMException('Image generation cancelled', 'AbortError')
  const canvas = document.createElement('canvas')
  try {
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas context unavailable')

    const sections = layoutSettlementImage(report, context, family)
    const logicalHeight = settlementImageHeight(sections)
    const { width, height } = settlementRasterSize(logicalHeight)

    if (width < reportWidth) {
      canvas.width = reportWidth
      canvas.height = Math.min(bandHeight, logicalHeight)
      return await encodeSettlementPngBands(
        reportWidth,
        logicalHeight,
        canvas.height,
        (top, rows) => {
          context.setTransform(1, 0, 0, 1, 0, -top)
          paintSettlementImage(
            context,
            sections,
            logicalHeight,
            family,
            top,
            top + rows
          )
          return context.getImageData(0, 0, reportWidth, rows).data
        },
        signal
      )
    }

    canvas.width = width
    canvas.height = height
    context.scale(width / reportWidth, height / logicalHeight)
    paintSettlementImage(context, sections, logicalHeight, family)
    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob?.size && blob.type === 'image/png') resolve(blob)
        else reject(new Error('PNG encoding failed'))
      }, 'image/png')
    })
    if (signal.aborted)
      throw new DOMException('Image generation cancelled', 'AbortError')
    return png
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}
