import { CategoryRepo, Category } from '@/entities/transaction'
import { db } from '@/lib/dexie'

/**
 * 分類本地儲存實作
 * 使用 Dexie (IndexedDB) 儲存分類資料
 * 採用平面結構，透過 parentId 建立層級關係
 */
class CategoryLocalRepo implements CategoryRepo {
  private getCategoryTreeIds(categories: Category[], rootId: string): string[] {
    const childrenByParent = new Map<string, string[]>()

    for (const category of categories) {
      if (category.parentId === null) {
        continue
      }

      const childIds = childrenByParent.get(category.parentId) ?? []
      childIds.push(category.id)
      childrenByParent.set(category.parentId, childIds)
    }

    const idsToDelete: string[] = []
    const queue = [rootId]
    const visited = new Set<string>()

    while (queue.length > 0) {
      const currentId = queue.shift()
      if (!currentId || visited.has(currentId)) {
        continue
      }

      visited.add(currentId)
      idsToDelete.push(currentId)

      const childIds = childrenByParent.get(currentId) ?? []
      queue.push(...childIds)
    }

    return idsToDelete
  }

  private async validateParentId(
    categoryId: string,
    parentId: string | null | undefined
  ): Promise<void> {
    if (parentId === undefined || parentId === null) {
      return
    }

    if (parentId === categoryId) {
      throw new Error(`Category ${categoryId} cannot be its own parent`)
    }

    const parent = await db.categories.get(parentId)
    if (!parent) {
      throw new Error(`Parent category with ID ${parentId} not found`)
    }
  }

  async create(category: Category, parentId?: string): Promise<Category> {
    try {
      // 檢查 ID 是否已存在
      const existing = await db.categories.get(category.id)
      if (existing) {
        throw new Error(`Category with ID ${category.id} already exists`)
      }

      // 如果提供了 parentId，覆蓋 category 的 parentId
      const categoryToCreate = parentId ? { ...category, parentId } : category

      await this.validateParentId(
        categoryToCreate.id,
        categoryToCreate.parentId
      )

      await db.categories.add(categoryToCreate)
      return categoryToCreate
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  async findById(id: string): Promise<Category | null> {
    try {
      const category = await db.categories.get(id)
      return category || null
    } catch (error) {
      console.error('Error finding category by ID:', error)
      throw error
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await db.categories.toArray()
    } catch (error) {
      console.error('Error finding all categories:', error)
      throw error
    }
  }

  async findByParent(parentId: string | null): Promise<Category[]> {
    try {
      const allCategories = await db.categories.toArray()
      return allCategories.filter((category) => category.parentId === parentId)
    } catch (error) {
      console.error('Error finding categories by parent:', error)
      throw error
    }
  }

  async findListByType(type: 'expense' | 'income'): Promise<Category[]> {
    try {
      return await db.categories.where('type').equals(type).toArray()
    } catch (error) {
      console.error('Error finding categories by type:', error)
      throw error
    }
  }

  async update(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    try {
      const existing = await db.categories.get(id)
      if (!existing) {
        return null
      }

      await this.validateParentId(id, updates.parentId)

      const updatedCategory = { ...existing, ...updates }
      await db.categories.put(updatedCategory)
      return updatedCategory
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await db.transaction('rw', db.categories, async () => {
        const existing = await db.categories.get(id)
        if (!existing) {
          return false
        }

        const allCategories = await db.categories.toArray()
        const idsToDelete = this.getCategoryTreeIds(allCategories, id)

        await db.categories.bulkDelete(idsToDelete)
        return true
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      await db.categories.clear()
    } catch (error) {
      console.error('Error clearing categories:', error)
      throw error
    }
  }
}

export default CategoryLocalRepo
