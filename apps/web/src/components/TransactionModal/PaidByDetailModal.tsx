import { Transaction } from '@/entities/transaction'
import { User, VirtualUser } from '@/entities/user'
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
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  compactInputClassNames,
  bottomSheetClassNames,
} from './formControlStyles'
import { DetailBalanceNotice } from './DetailBalanceNotice'

type Props = {
  isOpen: boolean
  paidByDetail: Transaction['paidByDetail']
  amount: number
  users: User[]
  onOpenChange: (open: boolean) => void
  onPaidByDetailChange: (paidByDetail: Transaction['paidByDetail']) => void
}

export default function PaidByDetailModal({
  isOpen,
  paidByDetail,
  amount,
  users,
  onOpenChange,
  onPaidByDetailChange,
}: Props) {
  const t = useTranslations()
  const [currentPaidByDetail, setCurrentPaidByDetail] =
    useState<Transaction['paidByDetail']>(paidByDetail)
  useEffect(() => {
    setCurrentPaidByDetail(paidByDetail)
  }, [paidByDetail])

  function checkIsUserSelected(user: User) {
    return currentPaidByDetail.some((item) => item.userId === user.id)
  }

  function handleUserCheckboxChange(user: User, checked: boolean) {
    setCurrentPaidByDetail((list) => {
      if (checked) {
        if (list.some((item) => item.userId === user.id)) return list
        return [...list, { userId: user.id, userType: user.type, amount: 0 }]
      } else {
        return list.filter((item) => item.userId !== user.id)
      }
    })
  }

  function getAmountByUser(user: User) {
    const detail = currentPaidByDetail.find(
      (item) => item.userId === user.id
    ) || { amount: 0 }
    return detail.amount.toString()
  }

  function updateAmountByUser(user: User, amount: number) {
    setCurrentPaidByDetail((prev) => {
      const existingDetail = prev.find((item) => item.userId === user.id)
      if (existingDetail) {
        return prev.map((item) =>
          item.userId === user.id ? { ...item, amount } : item
        )
      } else {
        return [...prev, { userId: user.id, userType: user.type, amount }]
      }
    })
  }

  const currentTotalAmount = currentPaidByDetail.reduce(
    (sum, item) => sum + item.amount,
    0
  )
  const isSaveDisabled =
    currentPaidByDetail.length === 0 || currentTotalAmount !== amount

  function setIsOpen(open: boolean) {
    if (!open) {
      setCurrentPaidByDetail(paidByDetail)
    }
    onOpenChange(open)
  }
  function handleCancel() {
    setIsOpen(false)
  }
  function handleSave() {
    onPaidByDetailChange(currentPaidByDetail)
    setIsOpen(false)
  }

  const difference = currentTotalAmount - amount

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
              {t('transactionForm.paidByDetailTitle')}
            </h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="user-option-list flex flex-col gap-3">
            {users.map((user) => {
              const selected = checkIsUserSelected(user)
              const isDeleted =
                user.type === 'virtual' &&
                Boolean((user as VirtualUser).deletedAt)
              const isCheckboxDisabled = isDeleted && !selected
              return (
                <div
                  key={user.id}
                  className={`user-option-list__item grid grid-cols-1 items-center gap-3 rounded-xl bg-muted/60 p-3 min-[360px]:grid-cols-[minmax(0,1fr)_minmax(7.5rem,0.9fr)] ${
                    !selected ? 'opacity-60' : ''
                  }`}
                >
                  <Checkbox
                    id={`user-${user.id}`}
                    className="min-w-0"
                    isSelected={selected}
                    isDisabled={isCheckboxDisabled}
                    onChange={(e) =>
                      handleUserCheckboxChange(user, e.target.checked)
                    }
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar
                        src={user.avatarUrl}
                        name={user.name}
                        size="sm"
                        className="h-6 w-6 shrink-0 text-tiny"
                      />
                      <div
                        className={`min-w-0 flex-1 truncate text-body text-foreground${
                          isDeleted ? ' line-through' : ''
                        }`}
                      >
                        {user.name}
                      </div>
                    </div>
                  </Checkbox>
                  <Input
                    size="sm"
                    classNames={compactInputClassNames}
                    label={t('transactionForm.amount')}
                    type="number"
                    inputMode="decimal"
                    isClearable
                    onClear={() => updateAmountByUser(user, 0)}
                    placeholder="0"
                    className="min-w-0"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-body text-muted-foreground">
                          $
                        </span>
                      </div>
                    }
                    value={getAmountByUser(user)}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      updateAmountByUser(user, isNaN(v) ? 0 : v)
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
