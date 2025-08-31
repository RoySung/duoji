import { CategoryRepo, Category } from '@/entities/transaction'
import { categoryList } from '@/mocks'

/**
 * 分類本地儲存實作
 * 使用 localStorage 儲存分類資料
 */
class CategoryLocalRepo implements CategoryRepo {
  private storageKey = 'duoji_categories'

  constructor() {
    this.initializeData()
  }

  /**
   * 初始化資料 - 如果 localStorage 中沒有資料，則使用預設的 mock 資料
   */
  private initializeData(): void {
    const existingData = localStorage.getItem(this.storageKey)
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(categoryList))
    }
  }

  /**
   * 從 localStorage 取得所有分類
   */
  private getStoredCategories(): Category[] {
    const data = localStorage.getItem(this.storageKey)
    return data ? JSON.parse(data) : categoryList
  }

  /**
   * 將分類儲存至 localStorage
   */
  private saveCategories(categories: Category[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(categories))
  }

  /**
   * 遞迴搜尋分類（包含子分類）
   */
  private findCategoryRecursively(
    categories: Category[], 
    id: string
  ): Category | null {
    for (const category of categories) {
      if (category.id === id) {
        return category
      }
      if (category.children) {
        const found = this.findCategoryRecursively(category.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 遞迴移除分類（包含子分類）
   */
  private removeCategoryRecursively(
    categories: Category[], 
    id: string
  ): Category[] {
    return categories
      .filter(category => category.id !== id)
      .map(category => ({
        ...category,
        children: category.children 
          ? this.removeCategoryRecursively(category.children, id)
          : undefined
      }))
  }

  /**
   * 遞迴收集指定類型的所有分類（扁平化結果）
   */
  private collectCategoriesByType(
    categories: Category[], 
    type: 'expense' | 'income'
  ): Category[] {
    const result: Category[] = []
    
    for (const category of categories) {
      if (category.type === type) {
        result.push(category)
      }
      if (category.children) {
        result.push(...this.collectCategoriesByType(category.children, type))
      }
    }
    
    return result
  }

  async create(category: Category, parentId?: string): Promise<Category> {
    const categories = this.getStoredCategories()
    
    // 檢查 ID 是否已存在
    const existing = this.findCategoryRecursively(categories, category.id)
    if (existing) {
      throw new Error(`Category with id ${category.id} already exists`)
    }
    
    if (parentId) {
      // 新增為指定父分類的子分類
      const parentCategory = this.findCategoryRecursively(categories, parentId)
      if (!parentCategory) {
        throw new Error(`Parent category with id ${parentId} not found`)
      }
      
      if (!parentCategory.children) {
        parentCategory.children = []
      }
      parentCategory.children.push(category)
    } else {
      // 新增分類到最上層
      categories.push(category)
    }
    
    this.saveCategories(categories)
    
    return category
  }

  async findById(id: string): Promise<Category | null> {
    const categories = this.getStoredCategories()
    return this.findCategoryRecursively(categories, id)
  }

  async findAll(): Promise<Category[]> {
    return this.getStoredCategories()
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    const categories = this.getStoredCategories()
    
    if (parentId === null) {
      // 回傳頂層分類
      return categories
    }
    
    // 搜尋指定父分類的子分類
    const parentCategory = this.findCategoryRecursively(categories, parentId)
    return parentCategory?.children || []
  }

  async findListByType(type: 'expense' | 'income'): Promise<Category[]> {
    const categories = this.getStoredCategories()
    return this.collectCategoriesByType(categories, type)
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = this.getStoredCategories()
    const category = this.findCategoryRecursively(categories, id)
    
    if (!category) {
      return null
    }
    
    // 更新分類資料
    Object.assign(category, updates)
    this.saveCategories(categories)
    
    return category
  }

  async delete(id: string): Promise<boolean> {
    const categories = this.getStoredCategories()
    const updatedCategories = this.removeCategoryRecursively(categories, id)
    
    // 檢查是否有分類被移除
    const wasRemoved = JSON.stringify(categories) !== JSON.stringify(updatedCategories)
    
    if (wasRemoved) {
      this.saveCategories(updatedCategories)
    }
    
    return wasRemoved
  }
}

export default CategoryLocalRepo