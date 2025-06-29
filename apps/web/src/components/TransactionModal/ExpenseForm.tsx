import { useEffect, useState, useCallback } from 'react'
import {
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
import SplitDetailModal from './SplitDetailModal'

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
// TODO: getting account book list from user
const accountBookOptions = [
  { id: '1', name: 'Account Book 1' },
  { id: '2', name: 'Account Book 2' },
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
    accountBookId: accountBookOptions[0].id,
    date: dayjs(now).format(DateFormat),
    description: '',
    tags: [],
    paidByDetail: [
      {
        user: userList[0], // 預設選擇第一個用戶
        amount: 0, // 預設金額為 0
      },
    ],
    splitDetail: userList.map((user) => ({
      user,
      amount: 0,
    })),
  })
  // paidByDetail
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
  const selectPaidByUser = useCallback(
    (userIds: Array<User['id']>) => {
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
    },
    [form.amount, userList]
  )
  // TODO: tags from history
  const date = parseAbsoluteToLocal(new Date(form.date).toISOString())

  const [isOpenPaidByOptions, setIsOpenPaidByOptions] = useState(false)
  function openPaidByOptionsModal() {
    setIsOpenPaidByOptions(true)
  }

  // splitDetail
  useEffect(() => {
    // 當 amount 改變時，更新 splitDetail
    const peopleCount = form.splitDetail.length
    const availableAmount = form.amount / peopleCount
    const newSplitDetail = form.splitDetail.map((item) => {
      return {
        ...item,
        amount: availableAmount,
      }
    })
    setForm((f) => ({
      ...f,
      splitDetail: newSplitDetail,
    }))
  }, [form.amount])
  const splitUserList = form.splitDetail.map((item) => item.user)
  function selectSplitUser(userIds: Array<User['id']>) {
    const split = userIds.map((id) => {
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
      splitDetail: split,
    }))
  }
  const [isOpenSplitDetail, setIsOpenSplitDetail] = useState(false)
  function openSplitDetailModal() {
    setIsOpenSplitDetail(true)
  }

  return (
    <div className="expense-form">
      <Form className="flex flex-col gap-4">
        <Input
          size="sm"
          isRequired
          label="Amount"
          type="number"
          isClearable
          onClear={() => {
            setForm((f) => ({ ...f, amount: 0 }))
          }}
          value={form.amount.toString()}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">$</span>
            </div>
          }
          onChange={(e) => {
            const value = parseFloat(e.target.value)
            if (!isNaN(value)) {
              setForm((f) => ({ ...f, amount: value }))
            } else {
              setForm((f) => ({ ...f, amount: 0 })) // 如果輸入無效，重置為 0
            }
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
          isClearable
          onClear={() => {
            setForm((f) => ({ ...f, description: '' }))
          }}
          onChange={(value) => {
            setForm((f) => ({ ...f, description: value.target.value }))
          }}
          placeholder='Enter a description (e.g. "Lunch with friends")'
        />
        <Select
          size="sm"
          label="Account Book"
          items={accountBookOptions}
          selectedKeys={[form.accountBookId || '']}
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
            onPress={openPaidByOptionsModal}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <PaidByDetailModal
            isOpen={isOpenPaidByOptions}
            onOpenChange={setIsOpenPaidByOptions}
            amount={form.amount}
            paidByDetail={form.paidByDetail}
            onPaidByDetailChange={(paidByDetail) => {
              setForm((f) => ({ ...f, paidByDetail }))
            }}
          />
        </div>
        <div className="flex items-start w-full">
          <div>
            <Select
              className="flex-1"
              size="sm"
              label="Split With"
              items={userList}
              selectionMode="multiple"
              placeholder="Select users to split with"
              isRequired
              selectedKeys={splitUserList.map((user) => user.id)}
              onSelectionChange={(ids) =>
                selectSplitUser(Array.from(ids) as User['id'][])
              }
              description="💡 Split equally by default. You can customize amounts if needed."
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
          </div>

          <Button
            isIconOnly
            color="primary"
            className="ml-2 mt-1"
            variant="ghost"
            onPress={openSplitDetailModal}
          >
            <PiGitBranchBold size={18} className="transform rotate-90" />
          </Button>
          <SplitDetailModal
            isOpen={isOpenSplitDetail}
            onOpenChange={setIsOpenSplitDetail}
            splitDetail={form.splitDetail}
            onSplitDetailChange={(splitDetail) => {
              setForm((f) => ({ ...f, splitDetail }))
            }}
            amount={form.amount}
          />
        </div>
      </Form>
    </div>
  )
}
