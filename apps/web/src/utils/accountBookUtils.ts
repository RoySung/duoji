import { AccountBook } from '@/entities/accountBook'

export type AccountBookFormValues = {
  name: string
  currency: string
  description: string
}

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
  values: AccountBookFormValues,
  ownerId: string
): AccountBook {
  const timestamp = Date.now()

  return {
    id: generateAccountBookId(),
    name: values.name.trim(),
    currency: values.currency.trim(),
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
    currency: values.currency.trim(),
    description: values.description.trim(),
    updatedAt: Date.now(),
  }
}

export function isAccountBookFormValid(values: AccountBookFormValues) {
  return values.name.trim().length > 0 && values.currency.trim().length > 0
}
