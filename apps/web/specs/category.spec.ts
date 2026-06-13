import {
  categoryList,
  expenseCategoryList,
  incomeCategoryList,
} from './fixtures'
import { CategorySchema } from '../src/entities/category'
import CategoryLocalRepo from '../src/repositories/categoryRepo/categoryLocalRepo'
import { db } from '../src/lib/dexie'

describe('Category System', () => {
  describe('Mock Data', () => {
    it('should have valid category structure', () => {
      expect(categoryList.length).toBeGreaterThan(0)
      expect(expenseCategoryList.length).toBeGreaterThan(0)
      expect(incomeCategoryList.length).toBeGreaterThan(0)

      // Total should equal expense + income categories
      expect(categoryList.length).toBe(
        expenseCategoryList.length + incomeCategoryList.length
      )
    })

    it('should validate against Zod schema', () => {
      categoryList.forEach((category) => {
        expect(() => CategorySchema.parse(category)).not.toThrow()
      })
    })

    it('should represent hierarchy with parentId references', () => {
      const rootCategories = categoryList.filter((cat) => cat.parentId === null)
      const childCategories = categoryList.filter(
        (cat) => cat.parentId !== null
      )

      expect(rootCategories.length).toBeGreaterThan(0)
      expect(childCategories.length).toBeGreaterThan(0)

      childCategories.forEach((category) => {
        expect(
          categoryList.some((parent) => parent.id === category.parentId)
        ).toBe(true)
      })
    })
  })

  describe('CategoryLocalRepo', () => {
    let repo: CategoryLocalRepo

    beforeEach(async () => {
      await db.open()
      repo = new CategoryLocalRepo()
      for (const category of categoryList) {
        await db.categories.put(category)
      }
    })

    afterEach(async () => {
      db.close()
      await db.delete()
    })

    it('should initialize with mock data', async () => {
      const categories = await repo.findAll()
      expect(categories.length).toBe(categoryList.length)
    })

    it('should find category by ID', async () => {
      const category = await repo.findById('1-1')
      expect(category).toBeTruthy()
      expect(category?.name).toBe('Breakfast')
    })

    it('should find categories by parent', async () => {
      const topLevelCategories = await repo.findByParent(null)
      expect(topLevelCategories.length).toBe(
        categoryList.filter((category) => category.parentId === null).length
      )
      topLevelCategories.forEach((category) => {
        expect(category.parentId).toBeNull()
      })

      const foodSubcategories = await repo.findByParent('1')
      expect(foodSubcategories.length).toBe(
        categoryList.filter((category) => category.parentId === '1').length
      )
      foodSubcategories.forEach((category) => {
        expect(category.parentId).toBe('1')
      })
    })

    it('should find categories by type', async () => {
      const expenseCategories = await repo.findListByType('expense')
      const incomeCategories = await repo.findListByType('income')

      // Should return flattened list of categories by type
      expect(expenseCategories.length).toBeGreaterThan(0)
      expect(incomeCategories.length).toBeGreaterThan(0)

      // All returned categories should have the correct type
      expenseCategories.forEach((cat) => {
        expect(cat.type).toBe('expense')
      })

      incomeCategories.forEach((cat) => {
        expect(cat.type).toBe('income')
      })
    })

    it('should find categories by accountBookId', async () => {
      const categories = await repo.findByAccountBookId('1')
      expect(categories.length).toBe(categoryList.length)
      categories.forEach((cat) => {
        expect(cat.accountBookId).toBe('1')
      })

      const emptyResult = await repo.findByAccountBookId('nonexistent')
      expect(emptyResult.length).toBe(0)
    })

    it('should reject self-parent references', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined)

      try {
        await expect(
          repo.update('1', {
            parentId: '1',
          })
        ).rejects.toThrow('cannot be its own parent')
      } finally {
        consoleErrorSpy.mockRestore()
      }
    })

    it('should bulk create categories and report failedIds with errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined)

      try {
        const result = await repo.bulkCreate([
          {
            id: 'bulk-root',
            name: 'Bulk Root',
            description: 'Created in bulk',
            type: 'expense',
            imageUrl: 'https://example.com/bulk-root.svg',
            parentId: null,
            accountBookId: '1',
            sortOrder: 999,
          },
          {
            id: 'bulk-child-invalid',
            name: 'Bulk Child Invalid',
            description: 'Invalid parent reference',
            type: 'expense',
            imageUrl: 'https://example.com/bulk-child.svg',
            parentId: 'missing-parent',
            accountBookId: '1',
            sortOrder: 1000,
          },
        ])

        expect(
          result.created.map((category: { id: string }) => category.id)
        ).toEqual(['bulk-root'])
        expect(result.failedIds).toEqual(['bulk-child-invalid'])
        expect(result.errors).toEqual([
          {
            id: 'bulk-child-invalid',
            message: 'Parent category with ID missing-parent not found',
          },
        ])
        await expect(repo.findById('bulk-root')).resolves.toMatchObject({
          id: 'bulk-root',
        })
        await expect(repo.findById('bulk-child-invalid')).resolves.toBeNull()
      } finally {
        consoleErrorSpy.mockRestore()
      }
    })

    it('should bulk update categories and report failedIds with errors', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined)

      try {
        const result = await repo.bulkUpdate([
          {
            id: '1',
            changes: {
              name: 'Food & Dining Updated',
            },
          },
          {
            id: 'missing-category',
            changes: {
              name: 'Missing',
            },
          },
          {
            id: '2',
            changes: {
              parentId: '2',
            },
          },
        ])

        expect(result.updated).toHaveLength(1)
        expect(result.updated[0]).toMatchObject({
          id: '1',
          name: 'Food & Dining Updated',
        })
        expect(result.failedIds).toEqual(['missing-category', '2'])
        expect(result.errors).toEqual([
          {
            id: 'missing-category',
            message: 'Category with ID missing-category not found',
          },
          {
            id: '2',
            message: 'Category 2 cannot be its own parent',
          },
        ])
        await expect(repo.findById('1')).resolves.toMatchObject({
          name: 'Food & Dining Updated',
        })
      } finally {
        consoleErrorSpy.mockRestore()
      }
    })

    it('should delete child categories recursively', async () => {
      await repo.create({
        id: '1-1-1',
        name: 'Cafe Breakfast',
        description: 'Nested breakfast category',
        type: 'expense',
        imageUrl:
          'https://api.iconify.design/lucide:cup-soda.svg?color=%23666666&width=100&height=100',
        parentId: '1-1',
        accountBookId: '1',
        sortOrder: 0,
      })

      await expect(repo.delete('1')).resolves.toBe(true)

      await expect(repo.findById('1')).resolves.toBeNull()
      await expect(repo.findById('1-1')).resolves.toBeNull()
      await expect(repo.findById('1-1-1')).resolves.toBeNull()
      await expect(repo.findById('2')).resolves.toBeTruthy()
    })

    it('should return false when deleting a missing category', async () => {
      await expect(repo.delete('missing-category')).resolves.toBe(false)
    })

    it('should bulk delete categories recursively and report failedIds with errors', async () => {
      await repo.create({
        id: '1-1-1',
        name: 'Cafe Breakfast',
        description: 'Nested breakfast category',
        type: 'expense',
        imageUrl: 'https://example.com/cafe-breakfast.svg',
        parentId: '1-1',
        accountBookId: '1',
        sortOrder: 1001,
      })

      const result = await repo.bulkDelete(['1', '1-1', 'missing-category'])

      expect(result.deletedIds.sort()).toEqual(['1', '1-1'].sort())
      expect(result.failedIds).toEqual(['missing-category'])
      expect(result.errors).toEqual([
        {
          id: 'missing-category',
          message: 'Category with ID missing-category not found',
        },
      ])
      await expect(repo.findById('1')).resolves.toBeNull()
      await expect(repo.findById('1-1')).resolves.toBeNull()
      await expect(repo.findById('1-1-1')).resolves.toBeNull()
    })
  })
})
