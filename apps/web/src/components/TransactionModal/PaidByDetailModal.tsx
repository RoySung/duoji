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
        return [
          ...list,
          { userId: user.id, userType: user.type, amount: 0 },
        ]
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
        return [
          ...prev,
          { userId: user.id, userType: user.type, amount },
        ]
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

  const NoticeInFooter = () => {
    const diff = currentTotalAmount - amount
    if (diff === 0) return <div className="h-8" />
    return (
      <div className="text-right h-8">
        <span className={diff > 0 ? 'text-green-500' : 'text-red-500'}>
          {diff > 0 ? `+${diff}` : diff}
        </span>
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2>PaidBy Detail</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="user-option-list flex gap-2 flex-col">
            {users.map((user) => {
              const selected = checkIsUserSelected(user)
              const isDeleted = user.type === 'virtual' && !!(user as VirtualUser).deletedAt
              const isCheckboxDisabled = isDeleted && !selected
              return (
                <div
                  key={user.id}
                  className={`user-option-list__item flex items-center gap-2 ${
                    !selected ? 'opacity-50' : ''
                  }`}
                >
                  <Checkbox
                    id={`user-${user.id}`}
                    className="flex-1"
                    isSelected={selected}
                    isDisabled={isCheckboxDisabled}
                    onChange={(e) =>
                      handleUserCheckboxChange(user, e.target.checked)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <Avatar
                        src={user.avatarUrl}
                        name={user.name}
                        size="sm"
                        className="w-5 h-5 text-tiny"
                      />
                      <div className={`w-24 truncate${isDeleted ? ' line-through' : ''}`}>{user.name}</div>
                    </div>
                  </Checkbox>
                  <Input
                    size="sm"
                    label="Amount"
                    type="number"
                    inputMode="decimal"
                    isClearable
                    onClear={() => updateAmountByUser(user, 0)}
                    placeholder="0"
                    className="flex-1"
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">$</span>
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
          <div>
            <NoticeInFooter />
            <div className="flex gap-2">
              <Button onPress={handleCancel}>Cancel</Button>
              <Button
                color="primary"
                onPress={handleSave}
                isDisabled={isSaveDisabled}
              >
                Save
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
