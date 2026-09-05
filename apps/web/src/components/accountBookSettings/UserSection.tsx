import { addToast, Button, Input } from '@heroui/react'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  PiCheckBold,
  PiPencilSimpleBold,
  PiUserCircleBold,
  PiWalletBold,
  PiXBold,
} from 'react-icons/pi'
import { compactInputClassNames } from '@/components/TransactionModal/formControlStyles'
import { isSharedWalletUser } from '@/entities/user'
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
  const softDeleteVirtualUser = useUserStore(
    (state) => state.softDeleteVirtualUser
  )

  const [newName, setNewName] = useState('')
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const hasSharedWallet = useMemo(
    () => users.some((user) => isSharedWalletUser(user)),
    [users]
  )

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return

    setIsAdding(true)
    try {
      const result = await addVirtualUser(accountBookId, trimmed)
      if (result) {
        setNewName('')
        addToast({
          title: t('userSection.toast.added', { name: trimmed }),
          color: 'success',
        })
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
        addToast({
          title: t('userSection.toast.nameUpdated'),
          color: 'success',
        })
      } else {
        addToast({
          title: t('userSection.toast.nameUpdateFailed'),
          color: 'danger',
        })
      }
    } finally {
      setIsSaving(false)
      setEditingId(null)
    }
  }

  async function handleRemove(virtualUserId: string, name: string) {
    const removed = await softDeleteVirtualUser(accountBookId, virtualUserId)
    if (removed) {
      addToast({
        title: t('userSection.toast.removed', { name }),
        color: 'success',
      })
    } else {
      addToast({
        title: t('userSection.toast.removeFailed'),
        color: 'danger',
      })
    }
    setConfirmRemoveId(null)
  }

  return (
    <section
      aria-labelledby="user-section-heading"
      className="surface-card border border-border p-4 !shadow-none sm:p-6"
    >
      <div className="space-y-1">
        <h2
          id="user-section-heading"
          className="text-title font-semibold text-foreground"
        >
          {t('userSection.title')}
        </h2>
        <p className="max-w-[70ch] text-body text-muted-foreground">
          {t('userSection.description')}
        </p>
      </div>

      <ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl bg-secondary">
        {users.length === 0 && !isLoading ? (
          <li className="px-4 py-5 text-body text-muted-foreground">
            {t('userSection.empty')}
          </li>
        ) : null}

        {users.map((user) => (
          <li
            key={user.id}
            className="flex min-w-0 flex-col gap-3 px-3 py-3 min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between sm:px-4"
          >
            {editingId === user.id ? (
              <div className="grid min-w-0 flex-1 grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-card">
                  {user.avatarUrl ? (
                    <img
                      alt=""
                      className="size-full object-cover"
                      src={user.avatarUrl}
                    />
                  ) : (
                    <PiUserCircleBold
                      aria-hidden="true"
                      className="text-primary"
                      size={20}
                    />
                  )}
                </span>
                <Input
                  autoFocus
                  aria-label={`${t('common.edit')}: ${user.name}`}
                  className="min-w-0"
                  classNames={compactInputClassNames}
                  size="md"
                  value={editName}
                  onValueChange={setEditName}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void handleSaveEdit(user.id)
                    if (event.key === 'Escape') setEditingId(null)
                  }}
                />
                <div className="col-start-2 flex shrink-0 items-center justify-end gap-1 sm:col-start-3 sm:row-start-1">
                  <Button
                    aria-label={`${t('common.save')}: ${user.name}`}
                    className="min-h-11 min-w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    color="primary"
                    disableRipple
                    isDisabled={
                      !editName.trim() || editName.trim() === user.name
                    }
                    isIconOnly
                    isLoading={isSaving}
                    size="sm"
                    variant="flat"
                    onPress={() => void handleSaveEdit(user.id)}
                  >
                    <PiCheckBold aria-hidden="true" size={14} />
                  </Button>
                  <Button
                    aria-label={`${t('common.cancel')}: ${user.name}`}
                    className="min-h-11 min-w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disableRipple
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setEditingId(null)}
                  >
                    <PiXBold
                      aria-hidden="true"
                      className="text-muted-foreground"
                      size={14}
                    />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-card">
                    {user.avatarUrl ? (
                      <img
                        alt=""
                        className="size-full object-cover"
                        src={user.avatarUrl}
                      />
                    ) : (
                      <PiUserCircleBold
                        aria-hidden="true"
                        className="text-primary"
                        size={20}
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <span className="block break-words text-body font-medium text-foreground">
                      {user.name}
                    </span>
                    <span className="mt-1.5 flex flex-wrap gap-1.5">
                      {user.type === 'registered' ? (
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-label font-medium text-primary">
                          {t('userSection.registered')}
                        </span>
                      ) : null}
                      {isSharedWalletUser(user) ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-1 text-label font-medium text-peach-foreground">
                          <PiWalletBold aria-hidden="true" size={12} />
                          {t('userSection.sharedWallet')}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </div>

                {user.type === 'virtual' ? (
                  confirmRemoveId === user.id ? (
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                      <span className="mr-auto text-label text-muted-foreground min-[360px]:mr-0">
                        {t('userSection.removePrompt')}
                      </span>
                      <Button
                        className="min-h-11 rounded-xl px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                        className="min-h-11 rounded-xl px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disableRipple
                        size="sm"
                        variant="light"
                        onPress={() => setConfirmRemoveId(null)}
                      >
                        {t('common.no')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center justify-end gap-1">
                      <Button
                        aria-label={`${t('common.edit')}: ${user.name}`}
                        className="min-h-11 min-w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disableRipple
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => startEdit(user.id, user.name)}
                      >
                        <PiPencilSimpleBold
                          aria-hidden="true"
                          className="text-muted-foreground"
                          size={14}
                        />
                      </Button>
                      <Button
                        aria-label={`${t('common.delete')}: ${user.name}`}
                        className="min-h-11 min-w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        disableRipple
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => setConfirmRemoveId(user.id)}
                      >
                        <PiXBold
                          aria-hidden="true"
                          className="text-muted-foreground"
                          size={14}
                        />
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
        className="mt-5 grid grid-cols-1 gap-2 min-[360px]:grid-cols-[minmax(0,1fr)_auto]"
        onSubmit={(event) => {
          event.preventDefault()
          void handleAdd()
        }}
      >
        <Input
          aria-label={t('userSection.addPlaceholder')}
          className="min-w-0"
          classNames={compactInputClassNames}
          placeholder={t('userSection.addPlaceholder')}
          size="md"
          value={newName}
          onValueChange={setNewName}
        />
        <Button
          className="min-h-11 rounded-xl px-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          color="primary"
          disableRipple
          isDisabled={!newName.trim()}
          isLoading={isAdding}
          size="md"
          type="submit"
        >
          {t('userSection.addButton')}
        </Button>
      </form>

      {!hasSharedWallet ? (
        <div className="mt-5 border-t border-border pt-5">
          <Button
            className="min-h-11 w-full justify-start rounded-xl bg-peach px-4 text-peach-foreground hover:bg-peach/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disableRipple
            isLoading={isAdding}
            size="md"
            variant="flat"
            onPress={async () => {
              setIsAdding(true)
              try {
                const sharedWalletName = t('userSection.sharedWallet')
                const result = await addVirtualUser(
                  accountBookId,
                  sharedWalletName,
                  { isSharedWallet: true }
                )
                if (result) {
                  addToast({
                    title: t('userSection.toast.added', {
                      name: sharedWalletName,
                    }),
                    color: 'success',
                  })
                } else {
                  addToast({
                    title: t('userSection.toast.addFailed'),
                    color: 'danger',
                  })
                }
              } finally {
                setIsAdding(false)
              }
            }}
          >
            <PiWalletBold aria-hidden="true" size={14} />
            {t('userSection.createSharedWallet')}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
