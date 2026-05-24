import { addToast, Button, Input } from '@heroui/react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PiCheckBold, PiPencilSimpleBold, PiUserCircleBold, PiXBold } from 'react-icons/pi'
import { useUserStore } from '@/stores/user'

type UserSectionProps = {
  accountBookId: string
}

export default function UserSection({ accountBookId }: UserSectionProps) {
  const t = useTranslations()
  const users = useUserStore((state) => state.activeUsers)
  const isLoading = useUserStore((state) => state.isLoading)
  const addVirtualUser = useUserStore((state) => state.addVirtualUser)
  const renameVirtualUser = useUserStore((state) => state.renameVirtualUser)
  const softDeleteVirtualUser = useUserStore((state) => state.softDeleteVirtualUser)

  const [newName, setNewName] = useState('')
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return

    setIsAdding(true)
    try {
      const result = await addVirtualUser(accountBookId, trimmed)
      if (result) {
        setNewName('')
        addToast({ title: t('userSection.toast.added', { name: trimmed }), color: 'success' })
      } else {
        addToast({ title: t('userSection.toast.addFailed'), color: 'danger' })
      }
    } finally {
      setIsAdding(false)
    }
  }

  function startEdit(id: string, currentName: string) {
    setConfirmRemoveId(null)
    setEditingId(id)
    setEditName(currentName)
  }

  async function handleSaveEdit(id: string) {
    const trimmed = editName.trim()
    if (!trimmed) return

    setIsSaving(true)
    try {
      const ok = await renameVirtualUser(accountBookId, id, trimmed)
      if (ok) {
        addToast({ title: t('userSection.toast.nameUpdated'), color: 'success' })
      } else {
        addToast({ title: t('userSection.toast.nameUpdateFailed'), color: 'danger' })
      }
    } finally {
      setIsSaving(false)
      setEditingId(null)
    }
  }

  async function handleRemove(virtualUserId: string, name: string) {
    const removed = await softDeleteVirtualUser(accountBookId, virtualUserId)
    if (removed) {
      addToast({ title: t('userSection.toast.removed', { name }), color: 'success' })
    } else {
      addToast({ title: t('userSection.toast.removeFailed'), color: 'danger' })
    }
    setConfirmRemoveId(null)
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-lg shadow-black/5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">{t('userSection.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('userSection.description')}
        </p>
      </div>

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {users.length === 0 && !isLoading ? (
          <li className="px-4 py-3 text-sm text-muted-foreground">
            {t('userSection.empty')}
          </li>
        ) : null}

        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            {editingId === user.id ? (
              <>
                <img
                  alt={user.name}
                  className="size-[18px] shrink-0 rounded-full object-cover"
                  src={user.avatarUrl}
                />
                <Input
                  autoFocus
                  className="flex-1"
                  size="sm"
                  value={editName}
                  onValueChange={setEditName}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void handleSaveEdit(user.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                />
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    color="primary"
                    disableRipple
                    isDisabled={!editName.trim() || editName.trim() === user.name}
                    isIconOnly
                    isLoading={isSaving}
                    size="sm"
                    variant="flat"
                    onPress={() => void handleSaveEdit(user.id)}
                  >
                    <PiCheckBold size={14} />
                  </Button>
                  <Button
                    disableRipple
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setEditingId(null)}
                  >
                    <PiXBold className="text-muted-foreground" size={14} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 min-w-0">
                  {user.avatarUrl ? (
                    <img
                      alt={user.name}
                      className="size-[18px] shrink-0 rounded-full object-cover"
                      src={user.avatarUrl}
                    />
                  ) : (
                    <PiUserCircleBold
                      className="shrink-0 text-primary"
                      size={18}
                    />
                  )}
                  <span className="truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  {user.type === 'registered' ? (
                    <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-700">
                      {t('userSection.registered')}
                    </span>
                  ) : null}
                </div>

                {user.type === 'virtual' ? (
                  confirmRemoveId === user.id ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t('userSection.removePrompt')}</span>
                      <Button
                        color="danger"
                        disableRipple
                        isLoading={isLoading}
                        size="sm"
                        variant="flat"
                        onPress={() => void handleRemove(user.id, user.name)}
                      >
                        {t('common.yes')}
                      </Button>
                      <Button
                        disableRipple
                        size="sm"
                        variant="light"
                        onPress={() => setConfirmRemoveId(null)}
                      >
                        {t('common.no')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        disableRipple
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => startEdit(user.id, user.name)}
                      >
                        <PiPencilSimpleBold className="text-muted-foreground" size={14} />
                      </Button>
                      <Button
                        disableRipple
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setConfirmRemoveId(user.id)}
                      >
                        <PiXBold className="text-muted-foreground" size={14} />
                      </Button>
                    </div>
                  )
                ) : null}
              </>
            )}
          </li>
        ))}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          void handleAdd()
        }}
      >
        <Input
          className="flex-1"
          placeholder={t('userSection.addPlaceholder')}
          size="sm"
          value={newName}
          onValueChange={setNewName}
        />
        <Button
          color="primary"
          disableRipple
          isDisabled={!newName.trim()}
          isLoading={isAdding}
          size="sm"
          type="submit"
          variant="flat"
        >
          {t('userSection.addButton')}
        </Button>
      </form>
    </section>
  )
}
