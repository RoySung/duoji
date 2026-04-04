import { AccountBook, Currency } from '@/entities/accountBook'
import { userList } from '@/mocks/user'

export type AccountBookFormValues = {
  name: string
  currency: Currency
  description: string
}

const defaultOwner = userList[0]

export const defaultAccountBookFormValues: AccountBookFormValues = {
  name: '',
  currency: 'TWD',
  description: '',
}

function generateAccountBookId() {
  return globalThis.crypto?.randomUUID?.() ?? `account-book-${Date.now()}`
}

export function toAccountBookFormValues(
  accountBook: AccountBook | null | undefined
): AccountBookFormValues {
  if (!accountBook) {
    return defaultAccountBookFormValues
  }

  return {
    name: accountBook.name,
    currency: accountBook.currency,
    description: accountBook.description,
  }
}

export function buildAccountBookPayload(
  values: AccountBookFormValues
): AccountBook {
  const timestamp = Date.now()
  const ownerId = defaultOwner?.id ?? 'local-owner'

  return {
    id: generateAccountBookId(),
    name: values.name.trim(),
    currency: values.currency,
    description: values.description.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
    ownerId,
    userIds: [ownerId],
    virtualUsers: [],
  }
}

export function buildAccountBookUpdates(values: AccountBookFormValues) {
  return {
    name: values.name.trim(),
    currency: values.currency,
    description: values.description.trim(),
    updatedAt: Date.now(),
  }
}

export function isAccountBookFormValid(values: AccountBookFormValues) {
  return values.name.trim().length > 0
}
