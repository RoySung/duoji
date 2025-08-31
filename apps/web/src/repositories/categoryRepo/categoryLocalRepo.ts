import { CategoryRepo, Category } from '@/entities/transaction'
import { db } from '@/lib/dexie'

/**
 * 分類本地儲存實作
 * 使用 Dexie (IndexedDB) 儲存分類資料
 */
class CategoryLocalRepo implements CategoryRepo {
  /**
   * 重建分類樹狀結構
   */
  private buildCategoryTree(flatCategories: Category[]): Category[] {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []

    // 將所有分類放入 Map
    flatCategories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // 建構樹狀結構
    flatCategories.forEach((category) => {
      const cat = categoryMap.get(category.id)!

      if (category.children && category.children.length > 0) {
        category.children.forEach((child) => {
          const childCategory = categoryMap.get(child.id)
          if (childCategory) {
            cat.children!.push(childCategory)
          }
        })
      }

      // 判斷是否為根分類（沒有父分類的）
      const isRoot = !flatCategories.some((c) =>
        c.children?.some((child) => child.id === category.id)
      )

      if (isRoot) {
        rootCategories.push(cat)
      }
    })

    return rootCategories
  }

  async create(category: Category, parentId?: string): Promise<Category> {
    try {
      // 檢查 ID 是否已存在
      const existing = await db.categories
        .where('id')
        .equals(category.id)
        .first()
      if (existing) {
        throw new Error(`Category with id ${category.id} already exists`)
      }

      if (parentId) {
        // 處理子分類的情況
        const parentCategory = await db.categories
          .where('id')
          .equals(parentId)
          .first()
        if (!parentCategory) {
          throw new Error(`Parent category with id ${parentId} not found`)
        }

        // 更新父分類的 children 陣列
        const updatedParent = {
          ...parentCategory,
          children: [...(parentCategory.children || []), category],
        }
        await db.categories.put(updatedParent)
      }

      // 新增分類到資料庫
      await db.categories.put(category)

      return category
    } catch (error) {
      console.error('Failed to create category:', error)
      throw error
    }
  }

  async findById(id: string): Promise<Category | null> {
    try {
      const category = await db.categories.where('id').equals(id).first()
      return category || null
    } catch (error) {
      console.error('Failed to find category by id:', error)
      return null
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const allCategories = await db.categories.toArray()
      return this.buildCategoryTree(allCategories)
    } catch (error) {
      console.error('Failed to find all categories:', error)
      return []
    }
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    try {
      if (parentId === null) {
        // 回傳頂層分類 - 沒有被任何分類包含在 children 中的分類
        const allCategories = await db.categories.toArray()
        const childIds = new Set<string>()

        // 收集所有子分類的 ID
        allCategories.forEach((cat) => {
          if (cat.children) {
            cat.children.forEach((child) => childIds.add(child.id))
          }
        })

        // 回傳不在子分類 ID 集合中的分類
        return allCategories.filter((cat) => !childIds.has(cat.id))
      }

      // 搜尋指定父分類的子分類
      const parentCategory = await db.categories
        .where('id')
        .equals(parentId)
        .first()
      return parentCategory?.children || []
    } catch (error) {
      console.error('Failed to find categories by parent:', error)
      return []
    }
  }

  async findListByType(type: 'expense' | 'income'): Promise<Category[]> {
    try {
      const categories = await db.categories
        .where('type')
        .equals(type)
        .toArray()
      return categories
    } catch (error) {
      console.error('Failed to find categories by type:', error)
      return []
    }
  }

  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    try {
      const category = await db.categories.where('id').equals(id).first()

      if (!category) {
        return null
      }

      // 更新分類資料
      const updatedCategory = { ...category, ...updates }
      await db.categories.put(updatedCategory)

      return updatedCategory
    } catch (error) {
      console.error('Failed to update category:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // 檢查分類是否存在
      const category = await db.categories.where('id').equals(id).first()
      if (!category) {
        return false
      }

      // 遞迴刪除子分類
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          await this.delete(child.id)
        }
      }

      // 從父分類的 children 中移除此分類
      const allCategories = await db.categories.toArray()
      for (const parentCategory of allCategories) {
        if (parentCategory.children) {
          const updatedChildren = parentCategory.children.filter(
            (child) => child.id !== id
          )
          if (updatedChildren.length !== parentCategory.children.length) {
            await db.categories.put({
              ...parentCategory,
              children: updatedChildren,
            })
          }
        }
      }

      // 刪除分類本身
      await db.categories.where('id').equals(id).delete()

      return true
    } catch (error) {
      console.error('Failed to delete category:', error)
      return false
    }
  }

  async clear(): Promise<void> {
    try {
      await db.categories.clear()
    } catch (error) {
      console.error('Failed to clear categories:', error)
      throw error
    }
  }
}

export default CategoryLocalRepo
