import { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Avatar,
} from '@heroui/react'
import { clsx } from 'clsx'
import { Transaction } from '@/entities/transaction'
import { User, VirtualUser } from '@/entities/user'
import { useTranslations } from 'next-intl'
import {
  compactInputClassNames,
  bottomSheetClassNames,
} from './formControlStyles'
import { DetailBalanceNotice } from './DetailBalanceNotice'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  splitDetail: Transaction['splitDetail']
  users: User[]
  onSplitDetailChange: (splitDetail: Transaction['splitDetail']) => void
  amount: number
}

export default function SplitDetailModal({
  isOpen,
  onOpenChange,
  splitDetail,
  users,
  onSplitDetailChange,
  amount,
}: Props) {
  const t = useTranslations()
  const [currentSplitDetail, setCurrentSplitDetail] = useState<
    Transaction['splitDetail']
  >([])
  useEffect(() => {
    setCurrentSplitDetail(splitDetail)
  }, [splitDetail])

  function checkIsUserSelected(user: User) {
    return currentSplitDetail.some((item) => item.userId === user.id)
  }

  function handleUserCheckboxChange(user: User, checked: boolean) {
    let newDetail: Transaction['splitDetail']
    if (checked) {
      const selected = [
        ...currentSplitDetail,
        { userId: user.id, userType: user.type, amount: 0 },
      ]
      const avgAmount = amount / selected.length
      newDetail = selected.map((item) => ({ ...item, amount: avgAmount }))
    } else {
      const selected = currentSplitDetail.filter(
        (item) => item.userId !== user.id
      )
      const avgAmount = selected.length > 0 ? amount / selected.length : 0
      newDetail = selected.map((item) => ({ ...item, amount: avgAmount }))
    }
    setCurrentSplitDetail(newDetail)
  }

  function handleAmountChange(user: User, value: number) {
    setCurrentSplitDetail((detail) =>
      detail.map((item) =>
        item.userId === user.id ? { ...item, amount: value } : item
      )
    )
  }

  const currentTotalAmount = currentSplitDetail.reduce(
    (sum, item) => sum + item.amount,
    0
  )

  const difference = currentTotalAmount - amount
  const isSaveDisabled = currentTotalAmount !== amount

  function setIsOpen(open: boolean) {
    if (!open) {
      setCurrentSplitDetail(splitDetail)
    }
    onOpenChange(open)
  }
  function handleSave() {
    onSplitDetailChange(currentSplitDetail)
    setIsOpen(false)
  }
  function handleCancel() {
    setIsOpen(false)
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      scrollBehavior="inside"
      classNames={bottomSheetClassNames}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex w-full flex-col items-center gap-2">
            <h2 className="text-title font-semibold text-foreground">
              {t('transactionForm.splitDetailTitle')}
            </h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-3">
            {users.map((user) => {
              const selected = checkIsUserSelected(user)
              const isDeleted =
                user.type === 'virtual' &&
                Boolean((user as VirtualUser).deletedAt)
              const isCheckboxDisabled = isDeleted && !selected
              return (
                <div
                  key={user.id}
                  className={clsx(
                    'grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-muted/60 p-3 min-[360px]:grid-cols-[auto_minmax(0,1fr)_minmax(7.5rem,0.9fr)]',
                    { 'opacity-60': !selected }
                  )}
                >
                  <Checkbox
                    isSelected={selected}
                    isDisabled={isCheckboxDisabled}
                    onChange={(e) =>
                      handleUserCheckboxChange(user, e.target.checked)
                    }
                  />
                  <Avatar
                    src={user.avatarUrl}
                    name={user.name}
                    size="sm"
                    className="h-6 w-6 shrink-0 text-tiny"
                  />
                  <div
                    className={clsx(
                      'min-w-0 truncate text-body text-foreground',
                      { 'line-through': isDeleted }
                    )}
                  >
                    {user.name}
                  </div>
                  <Input
                    size="sm"
                    classNames={compactInputClassNames}
                    label={t('transactionForm.amount')}
                    type="number"
                    inputMode="decimal"
                    isClearable
                    onClear={() => handleAmountChange(user, 0)}
                    placeholder="0"
                    className="col-span-2 min-w-0 min-[360px]:col-span-1"
                    value={(
                      currentSplitDetail.find((item) => item.userId === user.id)
                        ?.amount ?? 0
                    ).toString()}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      handleAmountChange(user, isNaN(v) ? 0 : v)
                    }}
                    isDisabled={!selected}
                  />
                </div>
              )
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full">
            <DetailBalanceNotice difference={difference} />
            <div className="flex justify-end gap-2">
              <Button
                className="min-h-11 rounded-xl text-body"
                onPress={handleCancel}
              >
                {t('common.cancel')}
              </Button>
              <Button
                className="min-h-11 rounded-xl text-body"
                color="primary"
                variant="solid"
                onPress={handleSave}
                isDisabled={isSaveDisabled}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
