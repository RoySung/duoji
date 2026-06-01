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

  const NoticeInFooter = () => {
    const diff = currentTotalAmount - amount
    if (diff === 0) return <div className="h-8" />
    return (
      <div className="text-right h-8">
        <span
          className={clsx({
            'text-green-500': diff > 0,
            'text-red-500': diff < 0,
          })}
        >
          {diff > 0 ? `+${diff}` : diff}
        </span>
      </div>
    )
  }

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
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2>Split Detail</h2>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-2">
            {users.map((user) => {
              const selected = checkIsUserSelected(user)
              const isDeleted = user.type === 'virtual' && !!(user as VirtualUser).deletedAt
              const isCheckboxDisabled = isDeleted && !selected
              return (
                <div
                  key={user.id}
                  className={clsx('flex items-center gap-2', {
                    'opacity-50': !selected,
                  })}
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
                    className="w-5 h-5 text-tiny shrink-0"
                  />
                  <div className={clsx('w-24 truncate', { 'line-through': isDeleted })}>{user.name}</div>
                  <Input
                    size="sm"
                    label="Amount"
                    type="number"
                    inputMode="decimal"
                    isClearable
                    onClear={() => handleAmountChange(user, 0)}
                    placeholder="0"
                    className="flex-1"
                    value={(
                      currentSplitDetail.find(
                        (item) => item.userId === user.id
                      )?.amount ?? 0
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
