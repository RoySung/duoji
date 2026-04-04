import { useEffect } from 'react'
import { Avatar, DatePicker, Form, Input, Select, SelectItem } from '@heroui/react'
import { AccountBook } from '@/entities/accountBook'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import { User, VirtualUser } from '@/entities/user'
import CategorySelector from './CategorySelector'
import TagsInput from '../ui/TagInput'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import { useTransactionStore } from '@/stores/transaction'
import {
  applyIncomeRecipient,
  distributeTransactionAmount,
  formatTransactionDateValue,
  parseTransactionDateValue,
  resolveIncomeRecipientId,
} from '@/utils/transactionUtils'

type Props = {
  value: Transaction
  onChange: (nextValue: Transaction) => void
}

export default function IncomeForm({ value, onChange }: Props) {
  const now = new Date()
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const currentAccountBookId = useAccountBookStore(
    (state) => state.currentAccountBookId
  )
  const incomeCategories = useCategoryStore((state) => state.incomeCategories)
  const modalMode = useTransactionStore((state) => state.modalMode)
  const allUsers = useUserStore((state) => state.allUsers)
  const activeUsers = useUserStore((state) => state.activeUsers)
  const isEditMode = modalMode === 'edit'

  // Use allUsers for lookup in edit mode so deleted recipients are preserved
  const usersForLookup = isEditMode ? allUsers : activeUsers

  // Build the selector list: active users + current deleted recipient if in edit mode
  const currentRecipient = isEditMode
    ? allUsers.find(
        (u) =>
          u.id === value.receivedByUserId &&
          u.type === 'virtual' &&
          (u as VirtualUser).deletedAt
      )
    : undefined

  const usersForSelector: User[] = currentRecipient
    ? [...activeUsers, currentRecipient]
    : activeUsers

  const deletedRecipientId =
    isEditMode && currentRecipient ? currentRecipient.id : undefined

  useEffect(() => {
    if (!currentAccountBookId) {
      return
    }

    const nextAccountBookId =
      value.accountBookId &&
      accountBooks.some((accountBook) => accountBook.id === value.accountBookId)
        ? value.accountBookId
        : currentAccountBookId

    const nextRecipientId = resolveIncomeRecipientId({
      users: usersForLookup,
      accountBookId: nextAccountBookId,
      receivedByUserId: value.receivedByUserId,
    })

    if (
      value.accountBookId === nextAccountBookId &&
      value.receivedByUserId === nextRecipientId
    ) {
      return
    }

    onChange(
      applyIncomeRecipient(
        {
          ...value,
          accountBookId: nextAccountBookId,
        },
        nextRecipientId,
        usersForLookup
      )
    )
  }, [accountBooks, currentAccountBookId, usersForLookup, onChange, value])

  const date = parseTransactionDateValue(value.date)

  return (
    <div className="income-form">
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
          onChange={(event) => {
            const nextAmount = parseFloat(event.target.value)
            if (!isNaN(nextAmount)) {
              onChange(distributeTransactionAmount(value, nextAmount))
              return
            }

            onChange(distributeTransactionAmount(value, 0))
          }}
        />
        <CategorySelector
          categoryList={incomeCategories}
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
          placeholder='Enter a description (e.g. "Monthly salary")'
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
        <Select
          size="sm"
          label="Received By"
          items={usersForSelector}
          selectedKeys={
            value.receivedByUserId ? [value.receivedByUserId] : []
          }
          placeholder="Select an income recipient"
          isRequired
          isDisabled={usersForSelector.length === 0}
          disabledKeys={deletedRecipientId ? [deletedRecipientId] : []}
          onSelectionChange={(keys) => {
            const selectedId = Array.from(keys)[0]
            const nextRecipientId =
              typeof selectedId === 'string'
                ? selectedId
                : resolveIncomeRecipientId({
                    users: usersForLookup,
                    accountBookId: value.accountBookId,
                    receivedByUserId: value.receivedByUserId,
                  })

            onChange(applyIncomeRecipient(value, nextRecipientId, usersForLookup))
          }}
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
              {user.type === 'virtual' && (user as VirtualUser).deletedAt ? (
                <span className="line-through">{user.name}</span>
              ) : (
                user.name
              )}
            </SelectItem>
          )}
        </Select>
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
      </Form>
    </div>
  )
}
