import { AccountBook } from '@/entities/accountBook'

const baseTimestamp = 1710000000000

export const accountBookList: AccountBook[] = [
  {
    id: '1',
    name: 'Daily Life',
    currency: 'TWD',
    description: 'Personal day-to-day spending',
    createdAt: baseTimestamp,
    updatedAt: baseTimestamp,
    ownerId: '1',
    userIds: ['1', '2'],
    virtualUsers: [],
  },
  {
    id: '2',
    name: 'Tokyo Trip',
    currency: 'JPY',
    description: 'Shared travel budget for the next trip',
    createdAt: baseTimestamp + 1,
    updatedAt: baseTimestamp + 1,
    ownerId: '1',
    userIds: ['1', '2'],
    virtualUsers: [
      {
        id: 'v1',
        name: 'Dad',
        accountBookId: '2',
        createdAt: baseTimestamp + 1,
        updatedAt: baseTimestamp + 1,
      },
    ],
  },
]

export const accountBookOptions = accountBookList.map(({ id, name }) => ({
  id,
  name,
}))
