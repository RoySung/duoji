import { HeroUIProvider } from '@heroui/react'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import CategorySettingsPage from '@/components/categorySettings/CategorySettingsPage'
import { db } from '@/lib/dexie'
import { CategoryLocalRepo } from '@/repositories/categoryRepo'
import {
  AccountBookStoreProvider,
  createAccountBookStore,
} from '@/stores/accountBook'
import { CategoryStoreProvider, createCategoryStore } from '@/stores/category'

const bookId = 'category-settings-icons'
const customUrl = 'https://images.example.com/category?id=meal'
const replacementUrl = 'https://images.example.com/category?id=travel'

function clickButton(
  scope: typeof screen | ReturnType<typeof within>,
  name: string | RegExp
) {
  fireEvent.click(scope.getByRole('button', { name }))
}

function enterText(
  scope: ReturnType<typeof within>,
  label: string,
  value: string
) {
  fireEvent.change(scope.getByLabelText(label), {
    target: { value },
  })
}

async function openSettings(repo: CategoryLocalRepo) {
  const store = createCategoryStore(repo)
  await store.getState().initialize(bookId)

  return render(
    <HeroUIProvider disableAnimation>
      <AccountBookStoreProvider store={createAccountBookStore()}>
        <CategoryStoreProvider store={store}>
          <CategorySettingsPage accountBookId={bookId} onClose={jest.fn()} />
        </CategoryStoreProvider>
      </AccountBookStoreProvider>
    </HeroUIProvider>
  )
}

async function editCategory(name: string) {
  clickButton(screen, `Edit: ${name}`)
  return within(await screen.findByRole('dialog'))
}

async function saveSettings() {
  clickButton(screen, 'Save')
  await waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Discard' })).toBeNull()
  })
}

describe('Category settings icon persistence', () => {
  const repo = new CategoryLocalRepo()

  beforeEach(async () => {
    await db.open()
    await repo.clear()
  })

  it('saves root and child icon choices, prefills edits, and replaces the choice only on save', async () => {
    const settings = await openSettings(repo)

    clickButton(screen, 'Add Expense Group')
    const addGroup = within(await screen.findByRole('dialog'))
    enterText(addGroup, 'Name', 'Meal planning')
    clickButton(addGroup, 'Utensils')
    clickButton(addGroup, 'Add')

    clickButton(screen, /Meal planning.*sub-categor/)
    clickButton(screen, 'Add Sub-Category')
    const addChild = within(await screen.findByRole('dialog'))
    enterText(addChild, 'Name', 'Lunch prep')
    clickButton(addChild, 'Custom image')
    enterText(addChild, 'Image URL', customUrl)
    clickButton(addChild, 'Add')

    expect(
      (await repo.findByAccountBookId(bookId)).map(({ name }) => name)
    ).not.toContain('Meal planning')
    await saveSettings()

    const saved = await repo.findByAccountBookId(bookId)
    const root = saved.find(({ name }) => name === 'Meal planning')
    const child = saved.find(({ name }) => name === 'Lunch prep')
    expect(root?.icon).toEqual({ kind: 'builtin', key: 'utensils' })
    expect(child?.parentId).toBe(root?.id)
    expect(child?.icon).toEqual({ kind: 'custom', url: customUrl })

    settings.unmount()
    const reopened = await openSettings(repo)

    const editRoot = await editCategory('Meal planning')
    expect(
      editRoot.getByRole('button', { name: 'Built-in', pressed: true })
    ).toBeTruthy()
    expect(
      editRoot.getByRole('button', { name: 'Utensils', pressed: true })
    ).toBeTruthy()
    clickButton(editRoot, 'Cancel')

    clickButton(screen, /Meal planning.*sub-categor/)
    const editChild = await editCategory('Lunch prep')
    const saveButton = editChild.getByRole('button', { name: 'Save' })
    expect(saveButton.classList.contains('text-body')).toBe(true)
    expect(saveButton.classList.contains('!text-white')).toBe(true)
    expect(
      editChild.getByRole('button', { name: 'Custom image', pressed: true })
    ).toBeTruthy()
    expect(editChild.getByDisplayValue(customUrl)).toBeTruthy()
    enterText(editChild, 'Name', 'Lunch boxes')
    clickButton(editChild, 'Save')
    await saveSettings()
    expect(await repo.findById(child!.id)).toMatchObject({
      name: 'Lunch boxes',
      icon: { kind: 'custom', url: customUrl },
    })

    const switchChild = await editCategory('Lunch boxes')
    clickButton(switchChild, 'Built-in')
    clickButton(switchChild, 'Sandwich')
    clickButton(switchChild, 'Save')
    await saveSettings()
    expect((await repo.findById(child!.id))?.icon).toEqual({
      kind: 'builtin',
      key: 'sandwich',
    })

    const switchRoot = await editCategory('Meal planning')
    clickButton(switchRoot, 'Custom image')
    enterText(switchRoot, 'Image URL', replacementUrl)
    clickButton(switchRoot, 'Save')
    clickButton(screen, 'Discard')
    expect((await repo.findById(root!.id))?.icon).toEqual({
      kind: 'builtin',
      key: 'utensils',
    })
    const afterDiscard = await editCategory('Meal planning')
    expect(
      afterDiscard.getByRole('button', { name: 'Utensils', pressed: true })
    ).toBeTruthy()
    clickButton(afterDiscard, 'Custom image')
    enterText(afterDiscard, 'Image URL', replacementUrl)
    clickButton(afterDiscard, 'Save')
    await saveSettings()
    expect((await repo.findById(root!.id))?.icon).toEqual({
      kind: 'custom',
      url: replacementUrl,
    })

    reopened.unmount()
    await openSettings(repo)
    const rootAfterReload = await editCategory('Meal planning')
    expect(rootAfterReload.getByDisplayValue(replacementUrl)).toBeTruthy()
    clickButton(rootAfterReload, 'Cancel')
    clickButton(screen, /Meal planning.*sub-categor/)
    const switchedAfterReload = await editCategory('Lunch boxes')
    expect(
      switchedAfterReload.getByRole('button', {
        name: 'Sandwich',
        pressed: true,
      })
    ).toBeTruthy()
  })
})
