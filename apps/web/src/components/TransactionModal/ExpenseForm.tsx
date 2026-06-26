import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
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
import { User, VirtualUser, isSharedWalletUser } from '@/entities/user'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import { useAccountBookStore } from '@/stores/accountBook/index'
import { useCategoryStore } from '@/stores/category'
import { useUserStore } from '@/stores/user'
import SplitDetailModal from './SplitDetailModal'
import CategorySelector from './CategorySelector'
import { useAccountBookTagSuggestions } from '@/hooks/useAccountBookTagSuggestions'
import {
  amountInputClassNames,
  amountInputCurrencyClassName,
} from './amountInputStyles'
import { useAmountInputValue } from './useAmountInputValue'
import {
  formatTransactionDateValue,
  parseTransactionDateValue,
  buildUserAmountDetails,
  distributeTransactionAmount,
} from '@/utils/transactionUtils'

type Props = {
  value: Transaction
  onChange: (nextValue: Transaction) => void
  isEditMode: boolean
}

export default function ExpenseForm({ value, onChange, isEditMode }: Props) {
  const t = useTranslations()
  const now = new Date()
  const currentAccountBookId =
    useAccountBookStore((state) => state.currentAccountBookId) ?? ''
  const accountBooks = useAccountBookStore((state) => state.accountBooks)
  const expenseCategories = useCategoryStore((state) => state.expenseCategories)
  const allUsers = useUserStore((state) => state.allUsers)
  const activeUsers = useUserStore((state) => state.activeUsers)

  const selectedPaidByIds = value.paidByDetail.map((item) => item.userId)
  const selectedSplitIds = value.splitDetail.map((item) => item.userId)

  const isNotSharedWallet = (u: User) => !isSharedWalletUser(u)

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

  const usersForSplit = (isEditMode
    ? [
        ...activeUsers,
        ...allUsers.filter(
          (u) =>
            u.type === 'virtual' &&
            (u as VirtualUser).deletedAt &&
            selectedSplitIds.includes(u.id)
        ),
      ]
    : activeUsers).filter(isNotSharedWallet)

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
            title: t('transactionForm.errorTitle'),
            color: 'danger',
            description: t('transactionForm.errorNotFound'),
          })
        }
        return Boolean(u)
      })

    const isSharedWalletSelected = selectedUsers.some(isSharedWalletUser)
    const wasSharedWalletSelected = selectedPaidByIds.some(id => {
      const u = allUsers.find(user => user.id === id)
      return u && isSharedWalletUser(u)
    })

    const nextPaidByDetail = buildUserAmountDetails(selectedUsers, value.amount)

    if (isSharedWalletSelected && !wasSharedWalletSelected) {
      const activeRealUsers = activeUsers.filter(isNotSharedWallet)
      const nextSplitDetail = buildUserAmountDetails(activeRealUsers, value.amount)
      onChange({
        ...value,
        paidByDetail: nextPaidByDetail,
        splitDetail: nextSplitDetail,
      })
    } else {
      onChange({
        ...value,
        paidByDetail: nextPaidByDetail,
      })
    }
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
  const amountInput = useAmountInputValue({
    amount: value.amount,
    onAmountChange: (nextAmount) => {
      onChange(distributeTransactionAmount(value, nextAmount))
    },
  })
  const { suggestions: tagSuggestions } = useAccountBookTagSuggestions(
    value.accountBookId,
    value.tags
  )

  return (
    <div className="expense-form">
      <Form className="flex flex-col gap-4">
        <div data-onboarding-anchor="transaction-form-amount" className="w-full">
          <Input
            size="lg"
            isRequired
            label={t('transactionForm.amount')}
            type="text"
            inputMode="decimal"
            classNames={amountInputClassNames}
            isClearable
            onClear={amountInput.handleClear}
            onFocus={amountInput.handleFocus}
            onBlur={amountInput.handleBlur}
            value={amountInput.inputValue}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className={amountInputCurrencyClassName}>$</span>
              </div>
            }
            onChange={(e) => {
              amountInput.handleChange(e.target.value)
            }}
          />
        </div>
        <div data-onboarding-anchor="transaction-form-category" className="w-full">
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
        </div>
        <DatePicker
          isRequired
          size="sm"
          label={t('transactionForm.date')}
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
          label={t('transactionForm.description')}
          value={value.description}
          isClearable
          onClear={() => {
            onChange({ ...value, description: '' })
          }}
          onChange={(event) => {
            onChange({ ...value, description: event.target.value })
          }}
          placeholder={t('transactionForm.descriptionPlaceholderExpense')}
        />
        <Select
          size="sm"
          isRequired
          label={t('transactionForm.paymentMethod')}
          selectedKeys={value.paymentMethod ? [value.paymentMethod] : []}
          placeholder={t('transactionForm.paymentMethodPlaceholder')}
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
          label={t('transactionForm.accountBook')}
          items={accountBooks}
          selectedKeys={value.accountBookId ? [value.accountBookId] : []}
          placeholder={t('transactionForm.accountBookPlaceholder')}
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
          label={t('transactionForm.tags')}
          data={{
            keywords: value.tags,
          }}
          suggestions={tagSuggestions}
          onTagsChange={(tags) => {
            onChange({ ...value, tags })
          }}
        />
        <div className="flex items-center w-full" data-onboarding-anchor="transaction-form-payer">
          <Select
            className="flex-1"
            size="sm"
            label={t('transactionForm.paidBy')}
            items={usersForPaidBy}
            selectionMode="multiple"
            placeholder={t('transactionForm.paidByPlaceholder')}
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
        <div className="flex items-start w-full" data-onboarding-anchor="transaction-form-split">
          <div className="w-full">
            <Select
              className="flex-1"
              size="sm"
              label={t('transactionForm.splitWith')}
              items={usersForSplit}
              selectionMode="multiple"
              placeholder={t('transactionForm.splitWithPlaceholder')}
              isRequired
              selectedKeys={selectedSplitIds}
              onSelectionChange={(ids) =>
                selectSplitUsers(Array.from(ids) as User['id'][])
              }
              description={t('transactionForm.splitDescription')}
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
