import { RegisteredUser } from '../../src/entities/user'

export { accountBookList, accountBookOptions } from '../../src/mocks'
export {
  DEFAULT_CATEGORY_LIST as categoryList,
  DEFAULT_EXPENSE_CATEGORIES as expenseCategoryList,
  DEFAULT_INCOME_CATEGORIES as incomeCategoryList,
} from '../../src/mocks/category'

export const userList: RegisteredUser[] = [
  {
    id: '1',
    name: 'Roy',
    email: 'roy@example.com',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Roy&background=random&bold=true',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    name: 'Patty',
    email: 'patty@example.com',
    avatarUrl:
      'https://ui-avatars.com/api/?name=Patty&background=random&bold=true',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]
