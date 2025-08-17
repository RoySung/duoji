import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  avatarUrl: z.url(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export type User = z.infer<typeof UserSchema>
