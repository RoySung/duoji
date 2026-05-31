import { RegisteredUser, UserRepo } from '@/entities/user'
import { db } from '@/lib/dexie'

class UserLocalRepo implements UserRepo {
  async findByIds(ids: string[]): Promise<RegisteredUser[]> {
    if (ids.length === 0) return []
    return db.users.where('id').anyOf(ids).toArray()
  }

  async create(user: RegisteredUser): Promise<void> {
    await db.users.put(user)
  }
}

export default UserLocalRepo
