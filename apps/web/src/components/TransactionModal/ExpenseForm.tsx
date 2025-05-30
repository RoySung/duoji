import { useState } from 'react'
import {
  NumberInput,
  Select,
  SelectItem,
  Form,
  DatePicker,
  Input,
  Avatar,
} from '@heroui/react'
import { parseAbsoluteToLocal } from '@internationalized/date'
import dayjs from 'dayjs'
import TagsInput from '../ui/TagInput'

type User = {
  id: string
  name: string
  email: string
  avatarUrl: string
  createdAt: number
  updatedAt: number
}

type Expense = {
  amount: number
  accountBookId: string | null
  date: string // e.g. '2023/10/01'
  description: string
  tags: string[]
  paidBy: User
}

const DateFormat = 'YYYY/MM/DD'

// TODO: getting user list from account book
const userList: User[] = [
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

// TODO
/**
 * fields
 * - amount
 * - category
 * - date
 * - description
 * - accountBook
 * - tags
 * - paidBy
 * - splitOptions -> 待後續完成
 */
export default function ExpenseForm() {
  const now = new Date()
  const [form, setForm] = useState<Expense>({
    amount: 0,
    accountBookId: null,
    date: dayjs(now).format(DateFormat),
    description: '',
    tags: [],
    paidBy: userList[0], // 預設選擇第一個用戶
  })
  // TODO: tags from history
  const accountBookOptions = [
    { id: '1', name: 'Account Book 1' },
    { id: '2', name: 'Account Book 2' },
  ]
  const date = parseAbsoluteToLocal(new Date(form.date).toISOString())

  return (
    <div className="expense-form">
      <Form className="flex flex-col gap-4">
        <NumberInput
          size="sm"
          isRequired
          label="Amount"
          value={form.amount}
          onValueChange={(value) => {
            setForm((f) => ({ ...f, amount: value }))
          }}
        />
        {/* TODO: category */}
        <DatePicker
          isRequired
          size="sm"
          label="Date"
          granularity="day"
          value={date}
          onChange={(value) => {
            const isoDate = value
              ? value?.toAbsoluteString()
              : now.toISOString()
            const date = dayjs(isoDate).format(DateFormat)

            setForm((f) => ({
              ...f,
              date,
            }))
          }}
        />
        <Input
          size="sm"
          label="Description"
          value={form.description}
          onChange={(value) => {
            setForm((f) => ({ ...f, description: value.target.value }))
          }}
          placeholder='Enter a description (e.g. "Lunch with friends")'
        />
        <Select
          size="sm"
          label="Account Book"
          items={accountBookOptions}
          placeholder="Select an account book"
          isRequired
          onSelectionChange={(keys) => {
            const key = (Array.from(keys)[0] as string) || null
            setForm((f) => ({ ...f, accountBookId: key }))
          }}
        >
          {(item) => (
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
            keywords: form.tags,
          }}
          onTagsChange={(tags) => {
            setForm((f) => ({ ...f, tags }))
          }}
        />
        {/* TODO: split options */}
        <Select
          size="sm"
          label="Paid By"
          items={userList}
          placeholder="Select a user"
          isRequired
          defaultSelectedKeys={[form.paidBy.id]}
          onSelectionChange={(keys) => {
            const key = (Array.from(keys)[0] as string) || null
            const user = userList.find((u) => u.id === key)
            if (user) {
              setForm((f) => ({ ...f, paidBy: user }))
            }
          }}
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
      </Form>
    </div>
  )
}
