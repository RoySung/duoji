import { categoryList, expenseCategoryList, incomeCategoryList } from '../src/mocks'
import { CategorySchema } from '../src/entities/transaction'
import CategoryLocalRepo from '../src/repositories/categoryRepo/categoryLocalRepo'

describe('Category System', () => {
  describe('Mock Data', () => {
    it('should have valid category structure', () => {
      expect(categoryList.length).toBeGreaterThan(0)
      expect(expenseCategoryList.length).toBeGreaterThan(0)
      expect(incomeCategoryList.length).toBeGreaterThan(0)
      
      // Total should equal expense + income categories
      expect(categoryList.length).toBe(expenseCategoryList.length + incomeCategoryList.length)
    })

    it('should validate against Zod schema', () => {
      categoryList.forEach(category => {
        expect(() => CategorySchema.parse(category)).not.toThrow()
      })
    })

    it('should have hierarchical structure', () => {
      const categoriesWithChildren = categoryList.filter(cat => cat.children && cat.children.length > 0)
      expect(categoriesWithChildren.length).toBeGreaterThan(0)
    })

    it('should have Chinese descriptions for main categories', () => {
      categoryList.forEach(category => {
        expect(category.description).toBeTruthy()
        expect(category.description.length).toBeGreaterThan(0)
      })
    })

    it('should have valid icon URLs', () => {
      categoryList.forEach(category => {
        expect(category.imageUrl).toMatch(/^https:\/\/api\.iconify\.design\//)
        
        if (category.children) {
          category.children.forEach(child => {
            expect(child.imageUrl).toMatch(/^https:\/\/api\.iconify\.design\//)
          })
        }
      })
    })
  })

  describe('CategoryLocalRepo', () => {
    let repo: CategoryLocalRepo
    
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
      repo = new CategoryLocalRepo()
    })

    it('should initialize with mock data', async () => {
      const categories = await repo.findAll()
      expect(categories.length).toBe(categoryList.length)
    })

    it('should find category by ID', async () => {
      const category = await repo.findById('1-1')
      expect(category).toBeTruthy()
      expect(category?.name).toBe('早餐')
    })

    it('should find categories by parent', async () => {
      const topLevelCategories = await repo.findByParent(null)
      expect(topLevelCategories.length).toBe(categoryList.length)
      
      const foodSubcategories = await repo.findByParent('1')
      expect(foodSubcategories.length).toBeGreaterThan(0)
    })

    it('should get leaf categories', async () => {
      const leafCategories = await repo.findLeafCategories()
      expect(leafCategories.length).toBeGreaterThan(0)
      
      // All leaf categories should not have children
      leafCategories.forEach(category => {
        expect(category.children).toBeUndefined()
      })
    })
  })
})