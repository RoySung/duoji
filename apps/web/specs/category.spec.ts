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
      expect(category?.name).toBe('Breakfast')
    })

    it('should find categories by parent', async () => {
      const topLevelCategories = await repo.findByParent(null)
      expect(topLevelCategories.length).toBe(categoryList.length)
      
      const foodSubcategories = await repo.findByParent('1')
      expect(foodSubcategories.length).toBeGreaterThan(0)
    })

    it('should find categories by type', async () => {
      const expenseCategories = await repo.findListByType('expense')
      const incomeCategories = await repo.findListByType('income')
      
      // Should return flattened list of categories by type
      expect(expenseCategories.length).toBeGreaterThan(0)
      expect(incomeCategories.length).toBeGreaterThan(0)
      
      // All returned categories should have the correct type
      expenseCategories.forEach(cat => {
        expect(cat.type).toBe('expense')
      })
      
      incomeCategories.forEach(cat => {
        expect(cat.type).toBe('income')
      })
      
      // Should include both parent and child categories
      const hasExpenseSubcategories = expenseCategories.some(cat => cat.id.includes('-'))
      const hasIncomeSubcategories = incomeCategories.some(cat => cat.id.includes('-'))
      expect(hasExpenseSubcategories).toBe(true)
      expect(hasIncomeSubcategories).toBe(true)
    })
  })
})