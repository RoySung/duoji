import { useEffect, useState } from 'react'
import {
  Select,
  SelectItem,
  Form,
  DatePicker,
  Input,
  Button,
  addToast,
  Avatar,
} from '@heroui/react'
import TagsInput from '../ui/TagInput'
import { PiGitBranchBold } from 'react-icons/pi'
import PaidByDetailModal from './PaidByDetailModal'
import { AccountBook } from '@/entities/accountBook'
import { User, VirtualUser } from '@/entities/user'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import { useAccountBookStore } from '@/stores/accountBook/index'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import SplitDetailModal from './SplitDetailModal'
import CategorySelector from './CategorySelector'
import {
  formatTransactionDateValue,
  parseTransactionDateValue,
  buildUserAmountDetails,
  distributeTransactionAmount,
} from '@/utils/transactionUtils'

type Props = {
  value: Transaction
  onChange: (nextValue: Transaction) => void
}

export default function ExpenseForm({ value, onChange }: Props) {
  const now = new Date()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const expenseCategories = useCategoryStore((state) => state.expenseCategories)
  const modalMode = useTransactionStore((state) => state.modalMode)
  const allUsers = useUserStore((state) => state.allUsers)
  const activeUsers = useUserStore((state) => state.activeUsers)
  const isEditMode = modalMode === 'edit'

  const selectedPaidByIds = value.paidByDetail.map((item) => item.userId)
  const selectedSplitIds = value.splitDetail.map((item) => item.userId)

  // In edit mode: show active users + deleted users already on this transaction
  const usersForPaidBy = isEditMode
    ? [
        ...activeUsers,
        ...allUsers.filter(
          (u) =>
            u.type === 'virtual' &&
            (u as VirtualUser).deletedAt &&
            selectedPaidByIds.includes(u.id)
        ),
      ]
    : activeUsers

  const usersForSplit = isEditMode
    ? [
        ...activeUsers,
        ...allUsers.filter(
          (u) =>
            u.type === 'virtual' &&
            (u as VirtualUser).deletedAt &&
            selectedSplitIds.includes(u.id)
        ),
      ]
    : activeUsers

  useEffect(() => {
    if (!currentAccountBookId) {
      return
    }

    if (
      value.accountBookId &&
      accountBooks.some((accountBook) => accountBook.id === value.accountBookId)
    ) {
      return
    }

    onChange({
      ...value,
      accountBookId: currentAccountBookId,
    })
  }, [accountBooks, currentAccountBookId, onChange, value])

  function selectPaidByUsers(userIds: Array<User['id']>) {
    const selectedUsers = userIds
      .map((id) => allUsers.find((u) => u.id === id))
      .filter((u): u is User => {
        if (!u) {
          addToast({
            title: 'Error',
            color: 'danger',
            description: 'Selected person was not found.',
          })
        }
        return Boolean(u)
      })

    onChange({
      ...value,
      paidByDetail: buildUserAmountDetails(selectedUsers, value.amount),
    })
  }

  const date = parseTransactionDateValue(value.date)

  const [isOpenPaidByOptions, setIsOpenPaidByOptions] = useState(false)

  function selectSplitUsers(userIds: Array<User['id']>) {
    const selectedUsers = userIds
      .map((id) => allUsers.find((u) => u.id === id))
      .filter((u): u is User => Boolean(u))

    onChange({
      ...value,
      splitDetail: buildUserAmountDetails(selectedUsers, value.amount),
    })
  }
  const [isOpenSplitDetail, setIsOpenSplitDetail] = useState(false)

  return (
    <div className="expense-form">
      <Form className="flex flex-col gap-4">
        <Input
          size="sm"
          isRequired
          label="Amount"
          type="number"
          isClearable
          onClear={() => {
            onChange(distributeTransactionAmount(value, 0))
          }}
          value={value.amount.toString()}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          onChange={(e) => {
            const nextAmount = parseFloat(e.target.value)
            if (!isNaN(nextAmount)) {
              onChange(distributeTransactionAmount(value, nextAmount))
            } else {
              onChange(distributeTransactionAmount(value, 0))
            }
          }}
        />
        <CategorySelector
          categoryList={expenseCategories}
          selectedCategoryId={value.categoryId}
          onSelectCategory={(category) => {
            onChange({
              ...value,
              categoryId: category.id,
            })
          }}
        />
        <DatePicker
          isRequired
          size="sm"
          label="Date"
          granularity="day"
          value={date}
          onChange={(nextDate) => {
            onChange({
              ...value,
              date: formatTransactionDateValue(nextDate, now),
            })
          }}
        />
        <Input
          size="sm"
          label="Description"
          value={value.description}
          isClearable
          onClear={() => {
            onChange({ ...value, description: '' })
          }}
          onChange={(event) => {
            onChange({ ...value, description: event.target.value })
          }}
          placeholder='Enter a description (e.g. "Lunch with friends")'
        />
        <Select
          size="sm"
          isRequired
          label="Payment Method"
          selectedKeys={value.paymentMethod ? [value.paymentMethod] : []}
          placeholder="Select a payment method"
          onSelectionChange={(keys) => {
            const paymentMethod = Array.from(keys)[0]

            if (typeof paymentMethod !== 'string') {
              onChange({
                ...value,
                paymentMethod: DefaultPaymentMethod,
              })
              return
            }

            onChange({
              ...value,
              paymentMethod: paymentMethod as Transaction['paymentMethod'],
            })
          }}
        >
          {PaymentMethodValues.map((paymentMethod) => (
            <SelectItem key={paymentMethod} textValue={paymentMethod}>
              {paymentMethod}
            </SelectItem>
          ))}
        </Select>
        <Select
          size="sm"
          label="Account Book"
          items={accountBooks}
          selectedKeys={value.accountBookId ? [value.accountBookId] : []}
          placeholder="Select an account book"
          isRequired
          isDisabled={accountBooks.length === 0}
          onSelectionChange={(keys) => {
            const key = (Array.from(keys)[0] as string) || ''
            onChange({ ...value, accountBookId: key })
          }}
        >
          {(item: AccountBook) => (
            <SelectItem key={item.id} textValue={item.name}>
              {item.name}
            </SelectItem>
          )}
        </Select>
        {/* tags */}
        <TagsInput
          className="w-full"
          label="Tags"
          data={{
            keywords: value.tags,
          }}
          onTagsChange={(tags) => {
            onChange({ ...value, tags })
          }}
        />
        <div className="flex items-center w-full">
          <Select
            className="flex-1"
            size="sm"
            label="Paid By"
            items={usersForPaidBy}
            selectionMode="multiple"
            placeholder="Select who paid"
            isRequired
            selectedKeys={selectedPaidByIds}
            onSelectionChange={(ids) =>
              selectPaidByUsers(Array.from(ids) as User['id'][])
            }
          >
            {(user) => (
              <SelectItem
                key={user.id}
                textValue={user.name}
                startContent={
                  <Avatar
                    src={user.avatarUrl}
                    name={user.name}
                    size="sm"
                    className="w-5 h-5 text-tiny"
                  />
                }
              >
                {user.name}
              </SelectItem>
            )}
          </Select>
          <Button
            isIconOnly
            color="primary"
            className="ml-2"
            variant="ghost"
            onPress={() => setIsOpenPaidByOptions(true)}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <PaidByDetailModal
            isOpen={isOpenPaidByOptions}
            onOpenChange={setIsOpenPaidByOptions}
            amount={value.amount}
            paidByDetail={value.paidByDetail}
            users={usersForPaidBy}
            onPaidByDetailChange={(paidByDetail) => {
              onChange({ ...value, paidByDetail })
            }}
          />
        </div>
        <div className="flex items-start w-full">
          <div className="w-full">
            <Select
              className="flex-1"
              size="sm"
              label="Split With"
              items={usersForSplit}
              selectionMode="multiple"
              placeholder="Select people to split with"
              isRequired
              selectedKeys={selectedSplitIds}
              onSelectionChange={(ids) =>
                selectSplitUsers(Array.from(ids) as User['id'][])
              }
              description="💡 Split equally by default. You can customize amounts if needed."
            >
              {(user) => (
                <SelectItem
                  key={user.id}
                  textValue={user.name}
                  startContent={
                    <Avatar
                      src={user.avatarUrl}
                      name={user.name}
                      size="sm"
                      className="w-5 h-5 text-tiny"
                    />
                  }
                >
                  {user.name}
                </SelectItem>
              )}
            </Select>
          </div>

          <Button
            isIconOnly
            color="primary"
            className="ml-2 mt-1"
            variant="ghost"
            onPress={() => setIsOpenSplitDetail(true)}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <SplitDetailModal
            isOpen={isOpenSplitDetail}
            onOpenChange={setIsOpenSplitDetail}
            splitDetail={value.splitDetail}
            users={usersForSplit}
            onSplitDetailChange={(splitDetail) => {
              onChange({ ...value, splitDetail })
            }}
            amount={value.amount}
          />
        </div>
      </Form>
    </div>
  )
}
