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
import { Expense } from '@/entities/transaction'
import { User } from '@/entities/user'
import { userList } from '@/mocks'

type Props = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  splitDetail: Expense['splitDetail']
  onSplitDetailChange: (splitDetail: Expense['splitDetail']) => void
  amount: number
}

export default function SplitDetailModal({
  isOpen,
  onOpenChange,
  splitDetail,
  onSplitDetailChange,
  amount,
}: Props) {
  const [currentSplitDetail, setCurrentSplitDetail] = useState<
    Expense['splitDetail']
  >([])
  useEffect(() => {
    setCurrentSplitDetail(splitDetail)
  }, [splitDetail])

  // 勾選狀態
  function checkIsUserSelected(user: User) {
    return currentSplitDetail.some((item) => item.user.id === user.id)
  }

  // 勾選時均分
  function handleUserCheckboxChange(user: User, checked: boolean) {
    let newDetail: Expense['splitDetail']
    if (checked) {
      // 新增
      const selected = [...currentSplitDetail, { user, amount: 0 }]
      const avgAmount = amount / selected.length
      newDetail = selected.map((item) => ({ ...item, amount: avgAmount }))
    } else {
      // 移除
      const selected = currentSplitDetail.filter(
        (item) => item.user.id !== user.id
      )
      const avgAmount = selected.length > 0 ? amount / selected.length : 0
      newDetail = selected.map((item) => ({ ...item, amount: avgAmount }))
    }
    setCurrentSplitDetail(newDetail)
  }

  // 金額調整
  function handleAmountChange(user: User, value: number) {
    setCurrentSplitDetail((detail) =>
      detail.map((item) =>
        item.user.id === user.id ? { ...item, amount: value } : item
      )
    )
  }

  // check amount
  const currentTotalAmount = currentSplitDetail.reduce(
    (sum, item) => sum + item.amount,
    0
  )
  const NoticeInFooter = () => {
    return (
      <div className="text-right h-8">
        {(() => {
          const diff = currentTotalAmount - amount
          if (diff === 0) return null

          return (
            <span
              className={clsx({
                'text-green-500': diff > 0,
                'text-red-500': diff < 0,
              })}
            >
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )
        })()}
      </div>
    )
  }
  const isSaveDisabled = currentTotalAmount !== amount

  // save
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
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2>Split Detail</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            {userList.map((user) => {
              const selected = checkIsUserSelected(user)
              return (
                <div
                  key={user.id}
                  className={clsx('flex items-center gap-2', {
                    'opacity-50': !selected,
                  })}
                >
                  <Checkbox
                    isSelected={selected}
                    onChange={(e) =>
                      handleUserCheckboxChange(user, e.target.checked)
                    }
                  />
                  <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
                  <div className="w-24 truncate">{user.name}</div>
                  <Input
                    size="sm"
                    label="Amount"
                    type="number"
                    isClearable
                    onClear={() => handleAmountChange(user, 0)}
                    placeholder="0"
                    className="flex-1"
                    value={(
                      currentSplitDetail.find(
                        (item) => item.user.id === user.id
                      )?.amount ?? 0
                    ).toString()}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value)
                      if (!isNaN(v)) handleAmountChange(user, v)
                      else handleAmountChange(user, 0)
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
                variant="solid"
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
