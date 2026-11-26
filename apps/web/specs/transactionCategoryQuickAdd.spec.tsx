import { HeroUIProvider } from '@heroui/react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import CategorySelector from '@/components/TransactionModal/CategorySelector'
import {
  CategoryStoreProvider,
  createCategoryStore,
  useCategoryStore,
} from '@/stores/category'

function TransactionCategoryField({
  accountBookId,
  initialCategoryId,
}: {
  accountBookId: string
  initialCategoryId: string
}) {
  const categories = useCategoryStore((state) => state.incomeCategories)
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId)

  return (
    <CategorySelector
      accountBookId={accountBookId}
      categoryList={categories}
      selectedCategoryId={selectedCategoryId}
      onSelectCategory={(category) => setSelectedCategoryId(category.id)}
    />
  )
}

it('saves and immediately selects an income sub-category with a custom icon', async () => {
  const accountBookId = 'quick-add-custom-category-icon-book'
  const store = createCategoryStore()
  await store.getState().initialize(accountBookId)

  const root = store
    .getState()
    .incomeCategories.find((category) => category.parentId === null)!
  const url = 'https://images.example.com/icon?category=side-project'

  render(
    <HeroUIProvider disableAnimation>
      <CategoryStoreProvider store={store}>
        <TransactionCategoryField
          accountBookId={accountBookId}
          initialCategoryId={root.id}
        />
      </CategoryStoreProvider>
    </HeroUIProvider>
  )

  const rootTabIcon = screen
    .getByRole('tab', { name: root.name })
    .querySelector('svg[data-category-icon="builtin"]')
  expect(rootTabIcon?.classList.contains('p-0.5')).toBe(true)
  expect(
    rootTabIcon?.closest('span[aria-hidden="true"]')?.classList.contains('h-5')
  ).toBe(true)

  fireEvent.click(screen.getByRole('button', { name: 'Add Sub-Category' }))
  const modal = within(await screen.findByRole('dialog'))
  fireEvent.change(modal.getByPlaceholderText('e.g. Dining'), {
    target: { value: 'Side project' },
  })
  fireEvent.click(modal.getByRole('button', { name: 'Custom image' }))
  fireEvent.change(modal.getByRole('textbox', { name: /Image URL/ }), {
    target: { value: `  ${url}  ` },
  })
  fireEvent.click(modal.getByRole('button', { name: 'Add' }))

  const selectedChild = await screen.findByRole('button', {
    name: /Side project/,
    pressed: true,
  })
  const selectedIcon = selectedChild.querySelector(
    'img[data-category-icon="custom"]'
  )
  expect(selectedIcon?.getAttribute('src')).toBe(url)
  expect(selectedIcon?.classList.contains('p-0.5')).toBe(true)
  expect(
    selectedIcon?.closest('span[aria-hidden="true"]')?.classList.contains('h-5')
  ).toBe(true)
  fireEvent.error(selectedIcon!)
  expect(
    selectedChild.querySelector('svg[data-category-icon="fallback"]')
  ).toBeTruthy()
  const created = store
    .getState()
    .incomeCategories.find((category) => category.name === 'Side project')
  expect(created).toMatchObject({
    accountBookId,
    parentId: root.id,
    type: 'income',
    icon: { kind: 'custom', url },
  })

  const reloaded = createCategoryStore()
  await reloaded.getState().initialize(accountBookId)
  expect(
    reloaded
      .getState()
      .incomeCategories.find((category) => category.id === created?.id)
  ).toEqual(created)
})
