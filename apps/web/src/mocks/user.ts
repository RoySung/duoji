import { RegisteredUser } from '@/entities/user'

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
