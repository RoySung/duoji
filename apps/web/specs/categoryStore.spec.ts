import {
  Category,
  CategoryBulkDeleteResult,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
  CategoryRepo,
} from '../src/entities/category'
import { createCategoryStore } from '../src/stores/category'

function createCategoryFixture(overrides: Partial<Category> = {}): Category {
  return {
    id: 'category-1',
    name: 'Food',
    imageUrl: 'https://example.com/food.svg',
    description: 'Food expenses',
    type: 'expense',
    parentId: null,
    accountBookId: 'book-1',
    sortOrder: 0,
    ...overrides,
  }
}

class InMemoryCategoryRepo implements CategoryRepo {
  private categories: Category[]

  constructor(categories: Category[] = []) {
    this.categories = [...categories]
  }

  async create(category: Category): Promise<Category> {
    if (this.categories.some((existing) => existing.id === category.id)) {
      throw new Error(`Category with ID ${category.id} already exists`)
    }

    this.categories.push(category)
    return category
  }

  async bulkCreate(categories: Category[]) {
    const created: Category[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const category of categories) {
      try {
        created.push(await this.create(category))
      } catch (error) {
        failedIds.push(category.id)
        errors.push({
          id: category.id,
          message:
            error instanceof Error ? error.message : 'Unknown category error',
        })
      }
    }

    return { created, failedIds, errors }
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find((category) => category.id === id) ?? null
  }

  async findAll(): Promise<Category[]> {
    return [...this.categories]
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    return this.categories.filter((category) => category.parentId === parentId)
  }

  async findListByType(type: Category['type']): Promise<Category[]> {
    return this.categories.filter((category) => category.type === type)
  }

  async findByAccountBookId(accountBookId: string): Promise<Category[]> {
    return this.categories
      .filter((category) => category.accountBookId === accountBookId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    const index = this.categories.findIndex((category) => category.id === id)
    if (index === -1) {
      return null
    }

    const nextCategory = { ...this.categories[index], ...updates }
    this.categories[index] = nextCategory
    return nextCategory
  }

  async bulkUpdate(
    updates: CategoryBulkUpdateInput[]
  ): Promise<CategoryBulkUpdateResult> {
    const updated: Category[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const item of updates) {
      const nextCategory = await this.update(item.id, item.changes)
      if (!nextCategory) {
        failedIds.push(item.id)
        errors.push({
          id: item.id,
          message: `Category with ID ${item.id} not found`,
        })
        continue
      }

      updated.push(nextCategory)
    }

    return { updated, failedIds, errors }
  }

  async delete(id: string): Promise<boolean> {
    const nextCategories = this.categories.filter(
      (category) => category.id !== id
    )
    const deleted = nextCategories.length !== this.categories.length
    this.categories = nextCategories
    return deleted
  }

  async bulkDelete(ids: string[]): Promise<CategoryBulkDeleteResult> {
    const deletedIds: string[] = []
    const failedIds: string[] = []
    const errors: Array<{ id: string; message: string }> = []

    for (const id of ids) {
      const deleted = await this.delete(id)
      if (!deleted) {
        failedIds.push(id)
        errors.push({
          id,
          message: `Category with ID ${id} not found`,
        })
        continue
      }

      deletedIds.push(id)
    }

    return { deletedIds, failedIds, errors }
  }

  async clear(): Promise<void> {
    this.categories = []
  }
}

describe('Category Store bulk actions', () => {
  it('should bulk create categories with sequential sortOrder and refresh state once', async () => {
    const repo = new InMemoryCategoryRepo([
      createCategoryFixture({ id: 'root-1', name: 'Food', sortOrder: 0 }),
      createCategoryFixture({
        id: 'child-1',
        name: 'Breakfast',
        parentId: 'root-1',
        sortOrder: 0,
      }),
    ])
    const store = createCategoryStore(repo, {
      scopedAccountBookId: 'book-1',
      categories: await repo.findByAccountBookId('book-1'),
      initialized: true,
    })

    const result = await store.getState().bulkCreate([
      {
        id: 'root-2',
        accountBookId: 'book-1',
        name: 'Transport',
        description: 'Transport expenses',
        imageUrl: 'https://example.com/transport.svg',
        parentId: null,
        type: 'expense',
      },
      {
        id: 'child-2',
        accountBookId: 'book-1',
        name: 'Dinner',
        description: 'Dinner expenses',
        imageUrl: 'https://example.com/dinner.svg',
        parentId: 'root-1',
        type: 'expense',
      },
    ])

    expect(result.failedIds).toEqual([])
    expect(result.errors).toEqual([])
    expect(result.created).toHaveLength(2)
    expect(result.created[0]).toMatchObject({
      name: 'Transport',
      sortOrder: 1,
    })
    expect(result.created[1]).toMatchObject({
      name: 'Dinner',
      sortOrder: 1,
    })
    expect(
      store.getState().categories.map((category) => category.name)
    ).toEqual(['Food', 'Breakfast', 'Transport', 'Dinner'])
  })

  it('should bulk update categories and keep failedIds with errors', async () => {
    const repo = new InMemoryCategoryRepo([
      createCategoryFixture({ id: 'root-1', name: 'Food', sortOrder: 0 }),
      createCategoryFixture({ id: 'root-2', name: 'Shopping', sortOrder: 1 }),
    ])
    const store = createCategoryStore(repo, {
      scopedAccountBookId: 'book-1',
      categories: await repo.findByAccountBookId('book-1'),
      initialized: true,
    })

    const result = await store.getState().bulkUpdate([
      {
        id: 'root-1',
        changes: {
          name: 'Dining',
        },
      },
      {
        id: 'missing-category',
        changes: {
          name: 'Missing',
        },
      },
    ])

    expect(result.updated).toHaveLength(1)
    expect(result.failedIds).toEqual(['missing-category'])
    expect(result.errors).toEqual([
      {
        id: 'missing-category',
        message: 'Category with ID missing-category not found',
      },
    ])
    expect(
      store.getState().categories.find((category) => category.id === 'root-1')
    ).toMatchObject({ name: 'Dining' })
  })

  it('should bulk delete categories and refresh state while returning failedIds with errors', async () => {
    const repo = new InMemoryCategoryRepo([
      createCategoryFixture({ id: 'root-1', name: 'Food', sortOrder: 0 }),
      createCategoryFixture({ id: 'root-2', name: 'Shopping', sortOrder: 1 }),
    ])
    const store = createCategoryStore(repo, {
      scopedAccountBookId: 'book-1',
      categories: await repo.findByAccountBookId('book-1'),
      initialized: true,
    })

    const result = await store
      .getState()
      .bulkDelete(['root-1', 'missing-category'])

    expect(result.deletedIds).toEqual(['root-1'])
    expect(result.failedIds).toEqual(['missing-category'])
    expect(result.errors).toEqual([
      {
        id: 'missing-category',
        message: 'Category with ID missing-category not found',
      },
    ])
    expect(store.getState().categories.map((category) => category.id)).toEqual([
      'root-2',
    ])
  })
})
