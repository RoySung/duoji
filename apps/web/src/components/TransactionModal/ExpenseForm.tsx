import { useEffect, useState } from 'react'
import {
  NumberInput,
  Select,
  SelectItem,
  Form,
  DatePicker,
  Input,
  Avatar,
  Button,
} from '@heroui/react'
import { parseAbsoluteToLocal } from '@internationalized/date'
import dayjs from 'dayjs'
import TagsInput from '../ui/TagInput'
import { PiGitBranchBold } from 'react-icons/pi'
import PaidByDetailModal from './PaidByDetailModal'
import { User } from '@/entities/user'
import { Expense } from '@/entities/transaction'

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
 * - paidByDetail
 * - splitDetail
 */
export default function ExpenseForm() {
  const now = new Date()
  const [form, setForm] = useState<Expense>({
    amount: 0,
    accountBookId: null,
    date: dayjs(now).format(DateFormat),
    description: '',
    tags: [],
    paidByDetail: [
      {
        user: userList[0], // 預設選擇第一個用戶
        amount: 0, // 預設金額為 0
      },
    ], // 預設選擇第一個用戶
  })
  // 當 amount 改變時，更新 paidByDetail
  useEffect(() => {
    const peopleCount = form.paidByDetail.length
    const availableAmount = form.amount / peopleCount
    const newPaidByDetail = form.paidByDetail.map((item) => {
      return {
        ...item,
        amount: availableAmount,
      }
    })
    setForm((f) => ({
      ...f,
      paidByDetail: newPaidByDetail,
    }))
  }, [form.amount])
  const paidByUserList = form.paidByDetail.map((item) => item.user)
  function selectPaidByUser(userIds: Array<User['id']>) {
    const paidBy = userIds.map((id) => {
      const user = userList.find((u) => u.id === id)
      if (!user) {
        throw new Error(`User with id ${id} not found`)
      }

      const amount = form.amount / userIds.length // 均分
      return {
        user,
        amount,
      }
    })
    setForm((f) => ({
      ...f,
      paidByDetail: paidBy,
    }))
  }
  // TODO: 當 amount 改變時，更新 paidBy 的 amount
  // TODO: tags from history
  const accountBookOptions = [
    { id: '1', name: 'Account Book 1' },
    { id: '2', name: 'Account Book 2' },
  ]
  const date = parseAbsoluteToLocal(new Date(form.date).toISOString())

  const [isOpenSplitOptions, setIsOpenSplitOptions] = useState(false)
  function openSplitOptionsModal() {
    setIsOpenSplitOptions(true)
  }

  return (
    <div className="expense-form">
      <Form className="flex flex-col gap-4">
        <NumberInput
          size="sm"
          isRequired
          label="Amount"
          type="number"
          value={form.amount}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
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
        <div className="flex items-center w-full">
          <Select
            className="flex-1"
            size="sm"
            label="Paid By"
            items={userList}
            selectionMode="multiple"
            placeholder="Select a user"
            isRequired
            selectedKeys={paidByUserList.map((user) => user.id)}
            onSelectionChange={(ids) =>
              selectPaidByUser(Array.from(ids) as User['id'][])
            }
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
          <Button
            isIconOnly
            color="primary"
            className="ml-2"
            variant="ghost"
            onPress={openSplitOptionsModal}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <PaidByDetailModal
            isOpen={isOpenSplitOptions}
            onOpenChange={setIsOpenSplitOptions}
            amount={form.amount}
            paidByDetail={form.paidByDetail}
            onPaidByDetailChange={(paidByDetail) => {
              setForm((f) => ({ ...f, paidByDetail }))
            }}
          />
        </div>
      </Form>
    </div>
  )
}
