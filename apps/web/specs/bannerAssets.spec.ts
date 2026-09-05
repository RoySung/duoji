import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { stat } from 'node:fs/promises'

const requireFromNext = createRequire(require.resolve('next/package.json'))
const sharp = requireFromNext('sharp')

const assetDirectory = resolve(__dirname, '../public/images/ui')
const backgroundPath = resolve(assetDirectory, 'duoji-banner-background.webp')
const travelPath = resolve(assetDirectory, 'duoji-banner-travel.webp')
const maximumAssetSize = 350 * 1024

describe('transaction banner assets', () => {
  it('ships an opaque wide geometric background below the size budget', async () => {
    const [metadata, file] = await Promise.all([
      sharp(backgroundPath).metadata(),
      stat(backgroundPath),
    ])

    expect(metadata).toMatchObject({
      format: 'webp',
      hasAlpha: false,
      height: 788,
      width: 1400,
    })
    expect(file.size).toBeLessThanOrEqual(maximumAssetSize)
  })

  it('ships a transparent two-density travel cutout below the size budget', async () => {
    const [metadata, file, { data, info }] = await Promise.all([
      sharp(travelPath).metadata(),
      stat(travelPath),
      sharp(travelPath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true }),
    ])
    const cornerAlpha = data[3]
    const luggageAlpha = data[(270 * info.width + 430) * 4 + 3]

    expect(metadata).toMatchObject({
      format: 'webp',
      hasAlpha: true,
      height: 600,
      width: 900,
    })
    expect(cornerAlpha).toBe(0)
    expect(luggageAlpha).toBe(255)
    expect(file.size).toBeLessThanOrEqual(maximumAssetSize)
  })
})
