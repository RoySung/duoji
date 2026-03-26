import {
  CategoryRepo,
  Category,
  CategoryBulkCreateResult,
  CategoryBulkDeleteResult,
  CategoryBulkError,
  CategoryBulkUpdateInput,
  CategoryBulkUpdateResult,
} from '@/entities/category'
import { db } from '@/lib/dexie'

/**
 * 分類本地儲存實作
 * 使用 Dexie (IndexedDB) 儲存分類資料
 * 採用平面結構，透過 parentId 建立層級關係
 */
class CategoryLocalRepo implements CategoryRepo {
  private toBulkError(id: string, error: unknown): CategoryBulkError {
    return {
      id,
      message:
        error instanceof Error ? error.message : 'Unknown category error',
    }
  }

  private hasRequestedAncestor(
    categoryId: string,
    categoryById: Map<string, Category>,
    requestedIds: Set<string>
  ): boolean {
    let currentParentId = categoryById.get(categoryId)?.parentId ?? null

    while (currentParentId) {
      if (requestedIds.has(currentParentId)) {
        return true
      }

      currentParentId = categoryById.get(currentParentId)?.parentId ?? null
    }

    return false
  }

  private buildCategoryMap(categories: Category[]): Map<string, Category> {
    return new Map(categories.map((category) => [category.id, category]))
  }

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

  async bulkCreate(categories: Category[]): Promise<CategoryBulkCreateResult> {
    try {
      const existingCategories = await db.categories.toArray()
      const categoryById = this.buildCategoryMap(existingCategories)
      const created: Category[] = []
      const failedIds: string[] = []
      const errors: CategoryBulkError[] = []

      for (const category of categories) {
        try {
          if (categoryById.has(category.id)) {
            throw new Error(`Category with ID ${category.id} already exists`)
          }

          if (category.parentId !== undefined && category.parentId !== null) {
            if (category.parentId === category.id) {
              throw new Error(
                `Category ${category.id} cannot be its own parent`
              )
            }

            if (!categoryById.has(category.parentId)) {
              throw new Error(
                `Parent category with ID ${category.parentId} not found`
              )
            }
          }

          created.push(category)
          categoryById.set(category.id, category)
        } catch (error) {
          failedIds.push(category.id)
          errors.push(this.toBulkError(category.id, error))
        }
      }

      if (created.length > 0) {
        await db.categories.bulkAdd(created)
      }

      return {
        created,
        failedIds,
        errors,
      }
    } catch (error) {
      console.error('Error bulk creating categories:', error)
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

  async findByAccountBookId(accountBookId: string): Promise<Category[]> {
    try {
      const results = await db.categories
        .where('accountBookId')
        .equals(accountBookId)
        .toArray()
      return results.sort((a, b) => a.sortOrder - b.sortOrder)
    } catch (error) {
      console.error('Error finding categories by accountBookId:', error)
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

  async bulkUpdate(
    updates: CategoryBulkUpdateInput[]
  ): Promise<CategoryBulkUpdateResult> {
    const updated: Category[] = []
    const failedIds: string[] = []
    const errors: CategoryBulkError[] = []

    for (const item of updates) {
      try {
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
      } catch (error) {
        failedIds.push(item.id)
        errors.push(this.toBulkError(item.id, error))
      }
    }

    return {
      updated,
      failedIds,
      errors,
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

  async bulkDelete(ids: string[]): Promise<CategoryBulkDeleteResult> {
    try {
      return await db.transaction('rw', db.categories, async () => {
        const uniqueIds = [...new Set(ids)]
        const categories = await db.categories.toArray()
        const categoryById = this.buildCategoryMap(categories)
        const requestedIds = new Set(uniqueIds)
        const failedIds: string[] = []
        const errors: CategoryBulkError[] = []
        const deleteRootIds: string[] = []

        for (const id of uniqueIds) {
          if (!categoryById.has(id)) {
            failedIds.push(id)
            errors.push({
              id,
              message: `Category with ID ${id} not found`,
            })
            continue
          }

          if (this.hasRequestedAncestor(id, categoryById, requestedIds)) {
            continue
          }

          deleteRootIds.push(id)
        }

        const idsToDelete = new Set<string>()

        for (const rootId of deleteRootIds) {
          const treeIds = this.getCategoryTreeIds(categories, rootId)
          treeIds.forEach((id) => idsToDelete.add(id))
        }

        if (idsToDelete.size > 0) {
          await db.categories.bulkDelete([...idsToDelete])
        }

        const deletedIds = uniqueIds.filter((id) => categoryById.has(id))

        return {
          deletedIds,
          failedIds,
          errors,
        }
      })
    } catch (error) {
      console.error('Error bulk deleting categories:', error)
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
