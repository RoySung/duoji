import { Category, CategoryRepository, CategoryType } from '@/entities/transaction'
import { categoryList } from '@/mocks'

const STORAGE_KEY = 'duoji-categories'

/**
 * CategoryLocalRepo - 使用 localStorage 儲存分類資料的實作
 * 支援階層分類結構和完整的 CRUD 操作
 */
export class CategoryLocalRepo implements CategoryRepository {
  private getStoredCategories(): Category[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error reading categories from localStorage:', error)
    }
    return []
  }

  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    } catch (error) {
      console.error('Error saving categories to localStorage:', error)
      throw new Error('Failed to save categories')
    }
  }

  private initializeDefaultCategories(): void {
    const stored = this.getStoredCategories()
    if (stored.length === 0) {
      this.saveCategories(categoryList)
    }
  }

  /**
   * 建立新分類
   */
  async create(category: Category): Promise<Category> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    
    // 檢查是否已存在相同 ID
    if (categories.find(c => this.findInTree(c, category.id))) {
      throw new Error(`Category with id ${category.id} already exists`)
    }

    // 驗證 parentId 是否存在（如果提供的話）
    if (category.parentId) {
      const parentExists = categories.some(c => this.findInTree(c, category.parentId!))
      if (!parentExists) {
        throw new Error(`Parent category with id ${category.parentId} not found`)
      }
    }

    // 添加到適當位置
    if (category.parentId === null) {
      // 頂層分類
      categories.push(category)
    } else {
      // 子分類，添加到父分類的 children 中
      this.addToParent(categories, category.parentId, category)
    }

    this.saveCategories(categories)
    return category
  }

  /**
   * 根據 ID 查找分類
   */
  async findById(id: string): Promise<Category | null> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    
    for (const category of categories) {
      const found = this.findInTree(category, id)
      if (found) return found
    }
    return null
  }

  /**
   * 取得所有分類
   */
  async findAll(): Promise<Category[]> {
    this.initializeDefaultCategories()
    return this.getStoredCategories()
  }

  /**
   * 更新分類
   */
  async update(id: string, updateData: Partial<Category>): Promise<Category | null> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    const updated = this.updateInTree(categories, id, updateData)
    
    if (updated) {
      this.saveCategories(categories)
      return await this.findById(id)
    }
    return null
  }

  /**
   * 刪除分類
   */
  async delete(id: string): Promise<boolean> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    const deleted = this.deleteFromTree(categories, id)
    
    if (deleted) {
      this.saveCategories(categories)
    }
    return deleted
  }

  /**
   * 根據父分類 ID 查找子分類
   */
  async findByParent(parentId: string | null): Promise<Category[]> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    
    if (parentId === null) {
      // 回傳頂層分類
      return categories.filter(c => c.parentId === null)
    }
    
    // 找到指定的父分類並回傳其子分類
    for (const category of categories) {
      const parent = this.findInTree(category, parentId)
      if (parent && parent.children) {
        return parent.children
      }
    }
    return []
  }

  /**
   * 取得樹狀結構
   */
  async getTreeStructure(): Promise<Category[]> {
    return this.findAll()
  }

  /**
   * 根據名稱搜尋分類
   */
  async findByName(name: string): Promise<Category[]> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    const results: Category[] = []
    
    for (const category of categories) {
      this.searchByNameInTree(category, name, results)
    }
    return results
  }

  /**
   * 取得所有葉子節點分類（沒有子分類的分類）
   */
  async getAllLeafCategories(): Promise<Category[]> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    const leaves: Category[] = []
    
    for (const category of categories) {
      this.collectLeaves(category, leaves)
    }
    return leaves
  }

  /**
   * 根據類型篩選分類
   */
  async findByType(type: CategoryType): Promise<Category[]> {
    this.initializeDefaultCategories()
    const categories = this.getStoredCategories()
    const results: Category[] = []
    
    for (const category of categories) {
      this.filterByTypeInTree(category, type, results)
    }
    return results
  }

  // 私有輔助方法

  private findInTree(category: Category, id: string): Category | null {
    if (category.id === id) return category
    
    if (category.children) {
      for (const child of category.children) {
        const found = this.findInTree(child, id)
        if (found) return found
      }
    }
    return null
  }

  private updateInTree(categories: Category[], id: string, updateData: Partial<Category>): boolean {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        categories[i] = { ...categories[i], ...updateData }
        return true
      }
      if (categories[i].children) {
        if (this.updateInTree(categories[i].children!, id, updateData)) {
          return true
        }
      }
    }
    return false
  }

  private deleteFromTree(categories: Category[], id: string): boolean {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === id) {
        categories.splice(i, 1)
        return true
      }
      if (categories[i].children) {
        if (this.deleteFromTree(categories[i].children!, id)) {
          return true
        }
      }
    }
    return false
  }

  private addToParent(categories: Category[], parentId: string, newCategory: Category): boolean {
    for (const category of categories) {
      if (category.id === parentId) {
        if (!category.children) category.children = []
        category.children.push(newCategory)
        return true
      }
      if (category.children) {
        if (this.addToParent(category.children, parentId, newCategory)) {
          return true
        }
      }
    }
    return false
  }

  private searchByNameInTree(category: Category, name: string, results: Category[]): void {
    if (category.name.toLowerCase().includes(name.toLowerCase())) {
      results.push(category)
    }
    if (category.children) {
      for (const child of category.children) {
        this.searchByNameInTree(child, name, results)
      }
    }
  }

  private collectLeaves(category: Category, leaves: Category[]): void {
    if (!category.children || category.children.length === 0) {
      leaves.push(category)
    } else {
      for (const child of category.children) {
        this.collectLeaves(child, leaves)
      }
    }
  }

  private filterByTypeInTree(category: Category, type: CategoryType, results: Category[]): void {
    if (category.type === type) {
      results.push(category)
    }
    if (category.children) {
      for (const child of category.children) {
        this.filterByTypeInTree(child, type, results)
      }
    }
  }
}