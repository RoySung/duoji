import { Category, CategoryRepository } from '@/entities/transaction'
import { categoryList } from '@/mocks'

/**
 * 分類資料的本地存儲實作
 * 使用 localStorage 作為數據持久化方案
 */
export class CategoryLocalRepo implements CategoryRepository {
  private readonly STORAGE_KEY = 'duoji_categories'

  constructor() {
    this.initializeData()
  }

  /**
   * 初始化分類資料
   * 如果本地存儲中沒有數據，則使用模擬數據初始化
   */
  private initializeData(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categoryList))
    }
  }

  /**
   * 從本地存儲獲取所有分類
   */
  private getStoredCategories(): Category[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  /**
   * 儲存分類資料到本地存儲
   */
  private saveCategories(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories))
  }

  /**
   * 生成新的 ID
   */
  private generateId(): string {
    return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 遞迴查找分類
   */
  private findCategoryRecursive(categories: Category[], id: string): Category | null {
    for (const category of categories) {
      if (category.id === id) {
        return category
      }
      if (category.children) {
        const found = this.findCategoryRecursive(category.children, id)
        if (found) return found
      }
    }
    return null
  }

  /**
   * 遞迴更新分類
   */
  private updateCategoryRecursive(
    categories: Category[],
    id: string,
    updates: Partial<Category>
  ): boolean {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        categories[i] = { ...categories[i], ...updates }
        return true
      }
      if (categories[i].children) {
        const updated = this.updateCategoryRecursive(categories[i].children!, id, updates)
        if (updated) return true
      }
    }
    return false
  }

  /**
   * 遞迴刪除分類
   */
  private deleteCategoryRecursive(categories: Category[], id: string): boolean {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        categories.splice(i, 1)
        return true
      }
      if (categories[i].children) {
        const deleted = this.deleteCategoryRecursive(categories[i].children!, id)
        if (deleted) return true
      }
    }
    return false
  }

  /**
   * 收集所有後代分類
   */
  private collectDescendants(category: Category): Category[] {
    let descendants: Category[] = []
    if (category.children) {
      for (const child of category.children) {
        descendants.push(child)
        descendants = descendants.concat(this.collectDescendants(child))
      }
    }
    return descendants
  }

  // ========== 公開方法 ==========

  async create(category: Category): Promise<Category> {
    const categories = this.getStoredCategories()
    const newCategory = {
      ...category,
      id: category.id || this.generateId(),
    }
    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  }

  async findById(id: string): Promise<Category | null> {
    const categories = this.getStoredCategories()
    return this.findCategoryRecursive(categories, id)
  }

  async findAll(): Promise<Category[]> {
    return this.getStoredCategories()
  }

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const categories = this.getStoredCategories()
    const updated = this.updateCategoryRecursive(categories, id, updates)
    if (updated) {
      this.saveCategories(categories)
      return this.findCategoryRecursive(categories, id)
    }
    return null
  }

  async delete(id: string): Promise<boolean> {
    const categories = this.getStoredCategories()
    const deleted = this.deleteCategoryRecursive(categories, id)
    if (deleted) {
      this.saveCategories(categories)
    }
    return deleted
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    const categories = this.getStoredCategories()
    
    if (parentId === null) {
      // 返回頂層分類 (沒有父分類的)
      return categories
    }
    
    // 查找指定父分類
    const parent = this.findCategoryRecursive(categories, parentId)
    return parent?.children || []
  }

  async getTreeStructure(): Promise<Category[]> {
    // 返回完整的樹狀結構 (與 findAll 相同)
    return this.getStoredCategories()
  }

  async getRootCategories(): Promise<Category[]> {
    // 返回頂層分類
    return this.getStoredCategories()
  }

  async findDescendants(categoryId: string): Promise<Category[]> {
    const categories = this.getStoredCategories()
    const category = this.findCategoryRecursive(categories, categoryId)
    return category ? this.collectDescendants(category) : []
  }

  async findAncestors(categoryId: string): Promise<Category[]> {
    const categories = this.getStoredCategories()
    const ancestors: Category[] = []
    
    // 遞迴查找祖先路徑
    const findPath = (cats: Category[], targetId: string, path: Category[]): boolean => {
      for (const cat of cats) {
        const newPath = [...path, cat]
        if (cat.id === targetId) {
          ancestors.push(...path)
          return true
        }
        if (cat.children && findPath(cat.children, targetId, newPath)) {
          return true
        }
      }
      return false
    }
    
    findPath(categories, categoryId, [])
    return ancestors
  }
}