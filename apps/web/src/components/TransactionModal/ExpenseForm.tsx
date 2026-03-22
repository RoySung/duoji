import { useEffect, useState } from 'react'
import {
  Select,
  SelectItem,
  Form,
  DatePicker,
  Input,
  Avatar,
  Button,
  addToast,
} from '@heroui/react'
import TagsInput from '../ui/TagInput'
import { PiGitBranchBold } from 'react-icons/pi'
import PaidByDetailModal from './PaidByDetailModal'
import { AccountBook } from '@/entities/accountBook'
import { User } from '@/entities/user'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import { useAccountBookStore } from '@/stores/accountBook/index'
import SplitDetailModal from './SplitDetailModal'
import { expenseCategoryList, userList } from '@/mocks'
import CategorySelector from './CategorySelector'
import {
  formatTransactionDateValue,
  parseTransactionDateValue,
  buildUserAmountDetails,
  distributeTransactionAmount,
} from '@/utils/transactionUtils'

// TODO
/**
 * fields
 * - amount
 * - category
 * - date
 * - description
 * - accountBook
 * - tags
 * - paidByDetail
 * - splitDetail
 */
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

  const paidByUserList = value.paidByDetail.map((item) => item.user)
  function selectPaidByUser(userIds: Array<User['id']>) {
    const selectedUsers = userIds
      .map((id) => userList.find((user) => user.id === id))
      .filter((user): user is User => {
        if (!user) {
          addToast({
            title: 'Error',
            color: 'danger',
            description: 'Selected user was not found.',
          })
        }

        return Boolean(user)
      })

    onChange({
      ...value,
      paidByDetail: buildUserAmountDetails(selectedUsers, value.amount),
    })
  }

  const date = parseTransactionDateValue(value.date)

  const [isOpenPaidByOptions, setIsOpenPaidByOptions] = useState(false)
  function openPaidByOptionsModal() {
    setIsOpenPaidByOptions(true)
  }

  const splitUserList = value.splitDetail.map((item) => item.user)
  function selectSplitUser(userIds: Array<User['id']>) {
    const selectedUsers = userIds
      .map((id) => userList.find((user) => user.id === id))
      .filter((user): user is User => Boolean(user))

    onChange({
      ...value,
      splitDetail: buildUserAmountDetails(selectedUsers, value.amount),
    })
  }
  const [isOpenSplitDetail, setIsOpenSplitDetail] = useState(false)
  function openSplitDetailModal() {
    setIsOpenSplitDetail(true)
  }

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
          categoryList={expenseCategoryList}
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
            items={userList}
            selectionMode="multiple"
            placeholder="Select a user"
            isRequired
            selectedKeys={paidByUserList.map((user) => user.id)}
            onSelectionChange={(ids) =>
              selectPaidByUser(Array.from(ids) as User['id'][])
            }
          >
            {(item) => (
              <SelectItem
                key={item.id}
                textValue={item.name}
                startContent={<Avatar src={item.avatarUrl} alt={item.name} />}
              >
                {item.name}
              </SelectItem>
            )}
          </Select>
          <Button
            isIconOnly
            color="primary"
            className="ml-2"
            variant="ghost"
            onPress={openPaidByOptionsModal}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <PaidByDetailModal
            isOpen={isOpenPaidByOptions}
            onOpenChange={setIsOpenPaidByOptions}
            amount={value.amount}
            paidByDetail={value.paidByDetail}
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
              items={userList}
              selectionMode="multiple"
              placeholder="Select users to split with"
              isRequired
              selectedKeys={splitUserList.map((user) => user.id)}
              onSelectionChange={(ids) =>
                selectSplitUser(Array.from(ids) as User['id'][])
              }
              description="💡 Split equally by default. You can customize amounts if needed."
            >
              {(item) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                  startContent={<Avatar src={item.avatarUrl} alt={item.name} />}
                >
                  {item.name}
                </SelectItem>
              )}
            </Select>
          </div>

          <Button
            isIconOnly
            color="primary"
            className="ml-2 mt-1"
            variant="ghost"
            onPress={openSplitDetailModal}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <SplitDetailModal
            isOpen={isOpenSplitDetail}
            onOpenChange={setIsOpenSplitDetail}
            splitDetail={value.splitDetail}
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
