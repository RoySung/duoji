import { useEffect, useState, useRef } from 'react'
import { useLatest } from 'react-use'
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
import { LuInfo } from 'react-icons/lu'
import PaidByDetailModal from './PaidByDetailModal'
import { AccountBook } from '@/entities/accountBook'
import { User, VirtualUser, isSharedWalletUser } from '@/entities/user'
import {
  DefaultPaymentMethod,
  PaymentMethodValues,
  Transaction,
} from '@/entities/transaction'
import { useAccountBookStore } from '@/stores/accountBook/index'
import SplitDetailModal from './SplitDetailModal'
import CategorySelector from './CategorySelector'
import { useAccountBookTagSuggestions } from '@/hooks/useAccountBookTagSuggestions'
import { useCategoriesByAccountBook } from '@/hooks/useCategoriesByAccountBook'
import { useUsersByAccountBook } from '@/hooks/useUsersByAccountBook'
import {
  amountInputClassNames,
  amountInputCurrencyClassName,
} from './amountInputStyles'
import {
  compactDatePickerClassNames,
  compactInputClassNames,
  compactSelectClassNames,
} from './formControlStyles'
import { useAmountInputValue } from './useAmountInputValue'
import {
  formatTransactionDateValue,
  parseTransactionDateValue,
  buildUserAmountDetails,
  distributeTransactionAmount,
  getDefaultTransactionCategoryId,
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
  const {
    expenseCategories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = useCategoriesByAccountBook(value.accountBookId || currentAccountBookId)
  const {
    allUsers,
    activeUsers,
    isLoading: isLoadingUsers,
  } = useUsersByAccountBook(value.accountBookId || currentAccountBookId)

  const currency = accountBooks.find(
    (ab) => ab.id === (value.accountBookId || currentAccountBookId)
  )?.currency

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

  const usersForSplit = (
    isEditMode
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
  ).filter(isNotSharedWallet)

  const valueRef = useLatest(value)
  const lastBookIdRef = useRef<string | null>(value.accountBookId || null)

  useEffect(() => {
    if (!currentAccountBookId) {
      return
    }

    const currentValue = valueRef.current
    const nextAccountBookId =
      currentValue.accountBookId &&
      accountBooks.some(
        (accountBook) => accountBook.id === currentValue.accountBookId
      )
        ? currentValue.accountBookId
        : currentAccountBookId

    const isBookChanged = nextAccountBookId !== lastBookIdRef.current
    if (isBookChanged && (isLoadingUsers || isLoadingCategories)) {
      return
    }

    const nextCategoryId = isBookChanged
      ? getDefaultTransactionCategoryId('expense', expenseCategories)
      : currentValue.categoryId

    const nextPaidBy = isBookChanged
      ? buildUserAmountDetails(activeUsers.slice(0, 1), currentValue.amount)
      : currentValue.paidByDetail

    const nextSplit = isBookChanged
      ? buildUserAmountDetails(
          activeUsers.filter(isNotSharedWallet),
          currentValue.amount
        )
      : currentValue.splitDetail

    if (
      currentValue.accountBookId === nextAccountBookId &&
      currentValue.categoryId === nextCategoryId &&
      JSON.stringify(currentValue.paidByDetail) ===
        JSON.stringify(nextPaidBy) &&
      JSON.stringify(currentValue.splitDetail) === JSON.stringify(nextSplit)
    ) {
      if (isBookChanged) {
        lastBookIdRef.current = nextAccountBookId
      }
      return
    }

    onChange({
      ...currentValue,
      accountBookId: nextAccountBookId,
      categoryId: nextCategoryId,
      paidByDetail: nextPaidBy,
      splitDetail: nextSplit,
    })
    lastBookIdRef.current = nextAccountBookId
  }, [
    accountBooks,
    currentAccountBookId,
    activeUsers,
    expenseCategories,
    isLoadingUsers,
    isLoadingCategories,
    onChange,
    value.accountBookId,
    value.amount,
  ])

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
    const wasSharedWalletSelected = selectedPaidByIds.some((id) => {
      const u = allUsers.find((user) => user.id === id)
      return u && isSharedWalletUser(u)
    })

    const nextPaidByDetail = buildUserAmountDetails(selectedUsers, value.amount)

    if (isSharedWalletSelected && !wasSharedWalletSelected) {
      const activeRealUsers = activeUsers.filter(isNotSharedWallet)
      const nextSplitDetail = buildUserAmountDetails(
        activeRealUsers,
        value.amount
      )
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
    <div className="expense-form w-full">
      <Form className="flex w-full flex-col gap-5">
        <div
          data-onboarding-anchor="transaction-form-amount"
          className="w-full"
        >
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
        <div
          data-onboarding-anchor="transaction-form-category"
          className="w-full"
        >
          <CategorySelector
            categoryList={expenseCategories}
            selectedCategoryId={value.categoryId}
            accountBookId={value.accountBookId || currentAccountBookId}
            onCategoryAdded={refetchCategories}
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
          classNames={compactDatePickerClassNames}
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
          classNames={compactInputClassNames}
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
          classNames={compactSelectClassNames}
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
          {PaymentMethodValues.map((paymentMethod) => {
            const translatedMethod = t(
              `transactionForm.paymentMethods.${paymentMethod}` as any
            )
            return (
              <SelectItem key={paymentMethod} textValue={translatedMethod}>
                {translatedMethod}
              </SelectItem>
            )
          })}
        </Select>
        <Select
          size="sm"
          classNames={compactSelectClassNames}
          label={t('transactionForm.accountBook')}
          items={accountBooks}
          selectedKeys={value.accountBookId ? [value.accountBookId] : []}
          placeholder={t('transactionForm.accountBookPlaceholder')}
          isRequired
          isDisabled={accountBooks.length === 0}
          onSelectionChange={(keys) => {
            const key = (Array.from(keys)[0] as string) || ''
            onChange({
              ...value,
              accountBookId: key,
              categoryId: '',
              paidByDetail: [],
              splitDetail: [],
            })
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
        <div
          className="flex w-full items-start"
          data-onboarding-anchor="transaction-form-payer"
        >
          <div className="w-full">
            <Select
              className="flex-1"
              classNames={compactSelectClassNames}
              size="sm"
              label={t('transactionForm.paidBy')}
              items={usersForPaidBy.map((user) => ({
                ...user,
                paidAmount:
                  value.paidByDetail.find((d) => d.userId === user.id)
                    ?.amount ?? 0,
              }))}
              selectionMode="multiple"
              placeholder={t('transactionForm.paidByPlaceholder')}
              isRequired
              selectedKeys={selectedPaidByIds}
              description={
                <div className="flex items-center gap-1">
                  <LuInfo className="flex-shrink-0 text-primary" />
                  <span>{t('transactionForm.paidByDescription')}</span>
                </div>
              }
              onSelectionChange={(ids) => {
                const newIds = Array.from(ids) as User['id'][]

                const added = newIds.find(
                  (id) => !selectedPaidByIds.includes(id)
                )
                if (added) {
                  selectPaidByUsers([added])
                  return
                }

                const removed = selectedPaidByIds.find(
                  (id) => !newIds.includes(id)
                )
                if (removed) {
                  // Force single-select behavior: if the user clicks an already selected item (which triggers a removal),
                  // we forcefully re-select it so that the dropdown selection is not cleared.
                  selectPaidByUsers([removed])
                }
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
                  <div className="flex w-full min-w-0 items-center justify-between gap-3">
                    <span className="min-w-0 truncate">{user.name}</span>
                    {user.paidAmount > 0 ? (
                      <span className="shrink-0 text-label tabular-nums text-muted-foreground">
                        {user.paidAmount.toLocaleString()}
                        {currency ? ` ${currency}` : ''}
                      </span>
                    ) : null}
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
          <Button
            isIconOnly
            aria-label={t('transactionForm.paidBy')}
            color="primary"
            className="ml-2 mt-1 min-h-11 min-w-11 rounded-xl"
            variant="ghost"
            onPress={() => setIsOpenPaidByOptions(true)}
          >
            <PiGitBranchBold size={16} className="transform rotate-90" />
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
        <div
          className="flex w-full items-start"
          data-onboarding-anchor="transaction-form-split"
        >
          <div className="w-full">
            <Select
              className="flex-1"
              classNames={compactSelectClassNames}
              size="sm"
              label={t('transactionForm.splitWith')}
              items={usersForSplit.map((user) => ({
                ...user,
                splitAmount:
                  value.splitDetail.find((d) => d.userId === user.id)?.amount ??
                  0,
              }))}
              selectionMode="multiple"
              placeholder={t('transactionForm.splitWithPlaceholder')}
              isRequired
              selectedKeys={selectedSplitIds}
              onSelectionChange={(ids) =>
                selectSplitUsers(Array.from(ids) as User['id'][])
              }
              description={
                <div className="flex items-center gap-1">
                  <LuInfo className="flex-shrink-0 text-primary" />
                  <span>{t('transactionForm.splitDescription')}</span>
                </div>
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
                  <div className="flex w-full min-w-0 items-center justify-between gap-3">
                    <span className="min-w-0 truncate">{user.name}</span>
                    {user.splitAmount > 0 ? (
                      <span className="shrink-0 text-label tabular-nums text-muted-foreground">
                        {user.splitAmount.toLocaleString()}
                        {currency ? ` ${currency}` : ''}
                      </span>
                    ) : null}
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>

          <Button
            isIconOnly
            aria-label={t('transactionForm.splitWith')}
            color="primary"
            className="ml-2 mt-1 min-h-11 min-w-11 rounded-xl"
            variant="ghost"
            onPress={() => setIsOpenSplitDetail(true)}
          >
            <PiGitBranchBold size={16} className="transform rotate-90" />
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
