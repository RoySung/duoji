import { fireEvent, render, screen } from '@testing-library/react'
import { BUILTIN_CATEGORY_ICONS } from '@/constants/categoryIcons'
import { CategoryIconSchema } from '@/entities/category'
import CategoryIcon from '@/components/ui/CategoryIcon'

describe('category icon catalog and schema', () => {
  it('renders every catalog entry as a bundled SVG', () => {
    const { container } = render(
      <>
        {Object.entries(BUILTIN_CATEGORY_ICONS).map(([key, Icon]) => (
          <Icon key={key} />
        ))}
      </>
    )
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(Object.keys(BUILTIN_CATEGORY_ICONS).length)
    for (const icon of icons) expect(icon.children.length).toBeGreaterThan(0)
  })

  it('accepts known built-in keys and rejects unknown keys', () => {
    for (const key of Object.keys(BUILTIN_CATEGORY_ICONS)) {
      expect(
        CategoryIconSchema.safeParse({ kind: 'builtin', key }).success
      ).toBe(true)
    }
    for (const key of ['unknown', 'constructor']) {
      expect(
        CategoryIconSchema.safeParse({ kind: 'builtin', key }).success
      ).toBe(false)
    }
  })

  it.each([
    ['', false],
    ['/icons/coffee.svg', false],
    ['https://', false],
    ['https:/images.example.com/icon', false],
    ['http://images.example.com/coffee.svg', false],
    ['https://user@images.example.com/coffee.svg', false],
    ['data:image/svg+xml,example', false],
    ['https://images.example.com/icon?id=coffee', true],
  ])('validates custom URL %j', (url, valid) => {
    expect(CategoryIconSchema.safeParse({ kind: 'custom', url }).success).toBe(
      valid
    )
  })
})

describe('CategoryIcon', () => {
  it('renders the selected local SVG with an accessible label', () => {
    render(
      <CategoryIcon icon={{ kind: 'builtin', key: 'coffee' }} label="Coffee" />
    )

    const icon = screen.getByRole('img', { name: 'Coffee' })
    expect(icon.tagName).toBe('svg')
    expect(icon.getAttribute('class')).toContain('lucide-coffee')
  })

  it('falls back when a custom image fails and tries a different URL', () => {
    const onImageError = jest.fn()
    const url = 'https://images.example.com/coffee'
    const { rerender } = render(
      <CategoryIcon
        icon={{ kind: 'custom', url }}
        label="Coffee"
        onImageError={onImageError}
      />
    )

    const image = screen.getByRole('img', { name: 'Coffee' })
    expect(image.getAttribute('src')).toBe(url)
    expect(image.getAttribute('referrerpolicy')).toBe('no-referrer')
    expect(image.classList.contains('object-contain')).toBe(true)

    fireEvent.error(image)
    const fallback = screen.getByRole('img', { name: 'Coffee' })
    expect(fallback.getAttribute('data-category-icon')).toBe('fallback')
    expect(fallback.classList.contains('lucide-shapes')).toBe(true)
    expect(onImageError).toHaveBeenCalledTimes(1)

    const nextUrl = 'https://images.example.com/tea'
    rerender(
      <CategoryIcon icon={{ kind: 'custom', url: nextUrl }} label="Coffee" />
    )
    expect(
      screen.getByRole('img', { name: 'Coffee' }).getAttribute('src')
    ).toBe(nextUrl)
  })
})
