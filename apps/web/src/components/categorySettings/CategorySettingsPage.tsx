import { Button, Tab, Tabs, addToast } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { CATEGORY_ICONS, CategoryIconKey } from '@/constants/categoryIcons'
import { Category } from '@/entities/category'
import { TransactionType } from '@/entities/transaction'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import {
  PiFloppyDiskDuotone,
  PiPlusCircleDuotone,
  PiXBold,
} from 'react-icons/pi'
import AccountBookNavHeader from '@/components/accountBookSettings/AccountBookNavHeader'
import AddCategoryModal from './AddCategoryModal'
import CategoryGroupItem from './CategoryGroupItem'
import DeleteConfirmModal from './DeleteConfirmModal'

type CategorySettingsPageProps = {
  accountBookId: string
  onClose?: () => void
}

// Wrapper so each root group item can own its own useDragControls hook
function DraggableGroupItem({
  root,
  subCategories,
  onAddSubCategory,
  onEditRoot,
  onDeleteRoot,
  onEditSub,
  onDeleteSub,
  onReorderSubs,
}: {
  root: Category
  subCategories: Category[]
  onAddSubCategory: (parent: Category) => void
  onEditRoot: (category: Category) => void
  onDeleteRoot: (category: Category) => void
  onEditSub: (category: Category) => void
  onDeleteSub: (category: Category) => void
  onReorderSubs: (rootId: string, newOrder: Category[]) => void
}) {
  const dragControls = useDragControls()
  return (
    <Reorder.Item
      className="list-none"
      dragControls={dragControls}
      dragListener={false}
      value={root}
    >
      <CategoryGroupItem
        root={root}
        rootDragControls={dragControls}
        subCategories={subCategories}
        onAddSubCategory={onAddSubCategory}
        onDeleteRoot={onDeleteRoot}
        onDeleteSub={onDeleteSub}
        onEditRoot={onEditRoot}
        onEditSub={onEditSub}
        onReorderSubs={(newOrder) => onReorderSubs(root.id, newOrder)}
      />
    </Reorder.Item>
  )
}

export default function CategorySettingsPage({
  accountBookId,
  onClose,
}: CategorySettingsPageProps) {
  const isModalMode = onClose !== undefined
  const accountBooks = useAccountBookStore((s) => s.accountBooks)
  const accountBook = accountBooks.find((b) => b.id === accountBookId) ?? null

  const categories = useCategoryStore((s) => s.categories)
  const addCategory = useCategoryStore((s) => s.addCategory)
  const updateCategory = useCategoryStore((s) => s.updateCategory)
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)
  const isLoading = useCategoryStore((s) => s.isLoading)

  // --- Draft state ---
  const [draftCategories, setDraftCategories] = useState<Category[]>([])
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const addedIds = useRef(new Set<string>())
  const editedIds = useRef(new Set<string>())
  const deletedIds = useRef(new Set<string>())

  // Sync draft from store when there are no pending changes
  useEffect(() => {
    if (!isDirty) setDraftCategories([...categories])
  }, [categories, isDirty])

  // --- UI state ---
  const [activeTab, setActiveTab] = useState<TransactionType>('expense')

  // Add modal
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [parentForModal, setParentForModal] = useState<Category | null>(null)
  const [sectionTypeForModal, setSectionTypeForModal] = useState<
    TransactionType | undefined
  >()

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)

  // Delete confirm modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  // --- Derived data ---
  const rootCategories = draftCategories.filter((c) => c.parentId === null)
  const expenseRoots = rootCategories.filter((c) => c.type === 'expense')
  const incomeRoots = rootCategories.filter((c) => c.type === 'income')
  const subCategoriesOf = (rootId: string) =>
    draftCategories.filter((c) => c.parentId === rootId)
  const deleteSubCount = deleteTarget
    ? subCategoriesOf(deleteTarget.id).length
    : 0

  // --- Draft operations ---
  function draftAdd({
    name,
    iconKey,
    type,
    parentId = null,
  }: {
    name: string
    iconKey: CategoryIconKey
    type: TransactionType
    parentId?: string | null
  }) {
    const siblings = draftCategories.filter(
      (c) => c.accountBookId === accountBookId && c.parentId === parentId
    )
    const maxOrder = siblings.reduce(
      (m, c) => Math.max(m, c.sortOrder ?? -1),
      -1
    )
    const draftId = `draft__${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 7)}`
    const newCat: Category = {
      id: draftId,
      name,
      imageUrl: CATEGORY_ICONS[iconKey],
      description: '',
      type,
      parentId,
      accountBookId,
      sortOrder: maxOrder + 1,
    }
    addedIds.current.add(draftId)
    setDraftCategories((prev) => [...prev, newCat])
    setIsDirty(true)
  }

  function draftEdit(id: string, name: string, iconKey: CategoryIconKey) {
    setDraftCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name, imageUrl: CATEGORY_ICONS[iconKey] } : c
      )
    )
    if (!addedIds.current.has(id)) editedIds.current.add(id)
    setIsDirty(true)
  }

  function draftDelete(id: string) {
    const childIds = draftCategories
      .filter((c) => c.parentId === id)
      .map((c) => c.id)
    const idsToRemove = new Set([id, ...childIds])
    for (const removeId of idsToRemove) {
      if (!addedIds.current.has(removeId)) deletedIds.current.add(removeId)
      addedIds.current.delete(removeId)
      editedIds.current.delete(removeId)
    }
    setDraftCategories((prev) => prev.filter((c) => !idsToRemove.has(c.id)))
    setIsDirty(true)
  }

  function draftReorderRoots(type: TransactionType, newOrder: Category[]) {
    setDraftCategories((prev) => {
      const others = prev.filter((c) => c.parentId !== null || c.type !== type)
      const reordered = newOrder.map((c, i) => {
        if (!addedIds.current.has(c.id)) editedIds.current.add(c.id)
        return { ...c, sortOrder: i }
      })
      return [...others, ...reordered]
    })
    setIsDirty(true)
  }

  function draftReorderSubs(rootId: string, newOrder: Category[]) {
    setDraftCategories((prev) => {
      const others = prev.filter((c) => c.parentId !== rootId)
      const reordered = newOrder.map((c, i) => {
        if (!addedIds.current.has(c.id)) editedIds.current.add(c.id)
        return { ...c, sortOrder: i }
      })
      return [...others, ...reordered]
    })
    setIsDirty(true)
  }

  // --- Save flow ---
  async function handleSave() {
    setIsSaving(true)
    try {
      // 1. Delete real IDs
      for (const id of deletedIds.current) {
        const success = await deleteCategory(id)
        if (!success) throw new Error(`Failed to delete category ${id}`)
      }

      // 2. Add new root groups (in sortOrder)
      const draftToReal = new Map<string, string>()
      const draftRoots = draftCategories
        .filter((c) => addedIds.current.has(c.id) && c.parentId === null)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      for (const cat of draftRoots) {
        const created = await addCategory({
          name: cat.name,
          imageUrl: cat.imageUrl,
          description: cat.description,
          type: cat.type,
          parentId: null,
          accountBookId,
          sortOrder: cat.sortOrder,
        })
        draftToReal.set(cat.id, created.id)
      }

      // 3. Add new sub-categories (in sortOrder, resolve parentId via map)
      const draftSubs = draftCategories
        .filter((c) => addedIds.current.has(c.id) && c.parentId !== null)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      for (const cat of draftSubs) {
        const realParentId = draftToReal.get(cat.parentId!) ?? cat.parentId!
        await addCategory({
          name: cat.name,
          imageUrl: cat.imageUrl,
          description: cat.description,
          type: cat.type,
          parentId: realParentId,
          accountBookId,
          sortOrder: cat.sortOrder,
        })
      }

      // 4. Update edited real IDs (name/icon/sortOrder changes)
      for (const id of editedIds.current) {
        if (deletedIds.current.has(id)) continue
        const cat = draftCategories.find((c) => c.id === id)
        if (!cat) continue
        await updateCategory(id, {
          name: cat.name,
          imageUrl: cat.imageUrl,
          sortOrder: cat.sortOrder,
        })
      }

      addedIds.current.clear()
      editedIds.current.clear()
      deletedIds.current.clear()
      setIsDirty(false)
      addToast({ title: 'Categories saved', color: 'success' })
    } catch {
      addToast({ title: 'Failed to save categories', color: 'danger' })
    } finally {
      setIsSaving(false)
    }
  }

  function handleDiscard() {
    addedIds.current.clear()
    editedIds.current.clear()
    deletedIds.current.clear()
    setIsDirty(false)
    setDraftCategories([...categories])
  }

  // --- Modal openers ---
  function openAddGroup(sectionType: TransactionType) {
    setParentForModal(null)
    setSectionTypeForModal(sectionType)
    setAddModalOpen(true)
  }

  function openAddSubCategory(parent: Category) {
    setParentForModal(parent)
    setSectionTypeForModal(undefined)
    setAddModalOpen(true)
  }

  // --- Modal submit handlers ---
  function handleAddSubmit({
    name,
    iconKey,
    type,
  }: {
    name: string
    iconKey: CategoryIconKey
    type: TransactionType
  }) {
    draftAdd({ name, iconKey, type, parentId: parentForModal?.id ?? null })
    setAddModalOpen(false)
  }

  function handleEditSubmit({
    name,
    iconKey,
  }: {
    name: string
    iconKey: CategoryIconKey
  }) {
    if (editTarget) draftEdit(editTarget.id, name, iconKey)
    setEditModalOpen(false)
    setEditTarget(null)
  }

  function handleDeleteConfirm() {
    if (deleteTarget) draftDelete(deleteTarget.id)
    setDeleteModalOpen(false)
    setDeleteTarget(null)
  }

  function renderRoots(
    roots: Category[],
    type: TransactionType,
    addLabel: string
  ) {
    return (
      <section className={`flex flex-col gap-3 pt-2 ${isDirty ? 'pb-20' : ''}`}>
        <Reorder.Group
          as="div"
          axis="y"
          className="flex flex-col gap-3"
          values={roots}
          onReorder={(newOrder) => draftReorderRoots(type, newOrder)}
        >
          {roots.map((root) => (
            <DraggableGroupItem
              key={root.id}
              root={root}
              subCategories={subCategoriesOf(root.id)}
              onAddSubCategory={openAddSubCategory}
              onDeleteRoot={(cat) => {
                setDeleteTarget(cat)
                setDeleteModalOpen(true)
              }}
              onDeleteSub={(cat) => {
                setDeleteTarget(cat)
                setDeleteModalOpen(true)
              }}
              onEditRoot={(cat) => {
                setEditTarget(cat)
                setEditModalOpen(true)
              }}
              onEditSub={(cat) => {
                setEditTarget(cat)
                setEditModalOpen(true)
              }}
              onReorderSubs={draftReorderSubs}
            />
          ))}
        </Reorder.Group>

        <button
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-4 text-sm font-semibold text-primary/70 transition hover:bg-primary/5"
          type="button"
          onClick={() => openAddGroup(type)}
        >
          <PiPlusCircleDuotone className="text-base" /> {addLabel}
        </button>
      </section>
    )
  }

  const editInitialValues = editTarget
    ? {
        name: editTarget.name,
        iconKey: (Object.entries(CATEGORY_ICONS).find(
          ([, url]) => url === editTarget.imageUrl
        )?.[0] ?? 'default') as CategoryIconKey,
      }
    : undefined

  const content = (
    <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col gap-6 px-4 py-6">
      {!isModalMode && (
        <AccountBookNavHeader
          backHref="/settings/account-books"
          title="Category Settings"
        />
      )}

      {accountBook ? (
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-foreground">
            {accountBook.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Organize categories in this account book
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading categories…</p>
        </div>
      ) : (
        <Tabs
          aria-label="Category type"
          color="primary"
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(key) => setActiveTab(key as TransactionType)}
        >
          <Tab key="expense" title="Expense">
            {renderRoots(expenseRoots, 'expense', 'ADD EXPENSE GROUP')}
          </Tab>
          <Tab key="income" title="Income">
            {renderRoots(incomeRoots, 'income', 'ADD INCOME GROUP')}
          </Tab>
        </Tabs>
      )}

      {/* Save/Discard bar — sticky inside modal, fixed for page */}
      {isDirty && (
        <div
          className={
            isModalMode
              ? 'sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-3 shadow-md'
              : 'fixed bottom-0 left-0 right-0 z-50 flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-3 shadow-md'
          }
        >
          <Button disableRipple variant="flat" onPress={handleDiscard}>
            <PiXBold size={14} />
            Discard
          </Button>
          <Button
            color="primary"
            disableRipple
            isLoading={isSaving}
            startContent={isSaving ? null : <PiFloppyDiskDuotone size={16} />}
            onPress={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )

  const subModals = (
    <>
      <AddCategoryModal
        isOpen={addModalOpen}
        parentType={parentForModal?.type}
        sectionType={sectionTypeForModal}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
      <AddCategoryModal
        initialValues={editInitialValues}
        isOpen={editModalOpen}
        mode="edit"
        onClose={() => {
          setEditModalOpen(false)
          setEditTarget(null)
        }}
        onSubmit={handleEditSubmit}
      />
      <DeleteConfirmModal
        categoryName={deleteTarget?.name ?? ''}
        isOpen={deleteModalOpen}
        subCount={deleteSubCount}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )

  if (isModalMode) {
    return (
      <>
        {content}
        {subModals}
      </>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background text-foreground">
      {content}
      {subModals}
    </div>
  )
}
