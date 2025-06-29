import { Expense } from '@/entities/transaction'
import { User } from '@/entities/user'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { userList } from '@/mocks'

type Props = {
  isOpen: boolean
  paidByDetail: Expense['paidByDetail']
  amount: number
  onOpenChange: (open: boolean) => void
  onPaidByDetailChange: (paidByDetail: Expense['paidByDetail']) => void
}

export default function PaidByDetailModal({
  isOpen,
  paidByDetail,
  amount,
  onOpenChange,
  onPaidByDetailChange,
}: Props) {
  const [currentPaidByDetail, setCurrentPaidByDetail] =
    useState<Expense['paidByDetail']>(paidByDetail)
  useEffect(() => {
    setCurrentPaidByDetail(paidByDetail)
  }, [paidByDetail])

  // user selection
  function checkIsUserSelected(user: User) {
    return currentPaidByDetail.some((item) => item.user.id === user.id)
  }

  function handleUserCheckboxChange(user: User, checked: boolean) {
    setCurrentPaidByDetail((list) => {
      if (checked) {
        // 若已存在則不重複加入
        if (list.some((item) => item.user.id === user.id)) return list
        return [...list, { user, amount: 0 }]
      } else {
        // 移除該 user
        return list.filter((item) => item.user.id !== user.id)
      }
    })
  }

  // amount input
  function getAmountByUser(user: User) {
    const detail = currentPaidByDetail.find(
      (item) => item.user.id === user.id
    ) || { amount: 0 }
    return detail.amount.toString()
  }
  function updateAmountByUser(user: User, amount: number) {
    setCurrentPaidByDetail((prev) => {
      const existingDetail = prev.find((item) => item.user.id === user.id)
      if (existingDetail) {
        return prev.map((item) =>
          item.user.id === user.id ? { ...item, amount } : item
        )
      } else {
        return [...prev, { user, amount }]
      }
    })
  }

  // save
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
    return (
      <div className="text-right h-8">
        {(() => {
          const diff = currentTotalAmount - amount
          if (diff === 0) return null

          return (
            <span className={diff > 0 ? 'text-green-500' : 'text-red-500'}>
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )
        })()}
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
            {userList.map((user) => {
              let itemClass = 'user-option-list__item flex items-center gap-2'
              if (!checkIsUserSelected(user)) {
                itemClass += ' opacity-50'
              }

              return (
                <div key={user.id} className={itemClass}>
                  <Checkbox
                    id={`user-${user.id}`}
                    className="flex-1"
                    isSelected={checkIsUserSelected(user)}
                    onChange={(e) =>
                      handleUserCheckboxChange(user, e.target.checked)
                    }
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="w-24 truncate">{user.name}</div>
                    </div>
                  </Checkbox>
                  <Input
                    size="sm"
                    label="Amount"
                    type="number"
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
                      const value = parseFloat(e.target.value)
                      if (!isNaN(value)) {
                        updateAmountByUser(user, value)
                      } else {
                        updateAmountByUser(user, 0) // 如果輸入無效，重置為 0
                      }
                    }}
                    isDisabled={!checkIsUserSelected(user)}
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
