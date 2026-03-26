import { useEffect } from 'react'
import { DatePicker, Form, Input, Select, SelectItem } from '@heroui/react'
import { AccountBook } from '@/entities/accountBook'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import CategorySelector from './CategorySelector'
import TagsInput from '../ui/TagInput'
import { useAccountBookStore } from '@/stores/accountBook'
import { useCategoryStore } from '@/stores/category'
import {
  applyIncomeRecipient,
  distributeTransactionAmount,
  formatTransactionDateValue,
  getAccountBookParticipantUsers,
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

  const participantUsers = getAccountBookParticipantUsers(
    accountBooks,
    value.accountBookId || currentAccountBookId
  )

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
      accountBooks,
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
        nextRecipientId
      )
    )
  }, [accountBooks, currentAccountBookId, onChange, value])

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
          items={participantUsers}
          selectedKeys={value.receivedByUserId ? [value.receivedByUserId] : []}
          placeholder="Select an income recipient"
          isRequired
          isDisabled={participantUsers.length === 0}
          onSelectionChange={(keys) => {
            const selectedRecipientId = Array.from(keys)[0]
            const nextRecipientId =
              typeof selectedRecipientId === 'string'
                ? selectedRecipientId
                : resolveIncomeRecipientId({
                    accountBooks,
                    accountBookId: value.accountBookId,
                    receivedByUserId: value.receivedByUserId,
                  })

            onChange(applyIncomeRecipient(value, nextRecipientId))
          }}
        >
          {(item) => (
            <SelectItem key={item.id} textValue={item.name}>
              {item.name}
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
