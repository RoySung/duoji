import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@heroui/react'
import { PiUserBold, PiUsersBold, PiCheckBold } from 'react-icons/pi'
import { User, isDeletedUser } from '@/entities/user'

type Props = {
  availableMembers: User[]
  selectedMemberId: string | null
  onChange: (memberId: string | null) => void
}

export default function MemberFilterSelector({
  availableMembers,
  selectedMemberId,
  onChange,
}: Props) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)

  const selectedMember = availableMembers.find((m) => m.id === selectedMemberId)

  function handleSelect(memberId: string | null) {
    onChange(memberId)
    setIsOpen(false)
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
      offset={10}
      showArrow
    >
      <PopoverTrigger>
        <Button
          variant="flat"
          size="sm"
          startContent={
            selectedMember ? (
              <Avatar
                src={selectedMember.avatarUrl}
                name={selectedMember.name}
                size="sm"
                className="h-4 w-4 shrink-0 text-label"
              />
            ) : (
              <PiUserBold size={12} className="shrink-0" />
            )
          }
          className="min-h-11 min-w-[7rem] max-w-full rounded-xl bg-secondary px-3 text-body text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {selectedMember
            ? t('report.memberFilter.triggerSelected', {
                name: selectedMember.name,
              })
            : t('report.memberFilter.trigger')}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(18rem,calc(100vw-1rem))] rounded-2xl bg-popover p-0 text-popover-foreground shadow-[0_8px_24px_rgba(20,31,29,0.18)]">
        <div className="flex max-h-[min(24rem,calc(100vh-4.5rem))] w-full flex-col overflow-hidden">
          <div className="w-full border-b border-border px-4 pb-3 pt-4 text-left sm:px-5">
            <span className="text-title font-semibold text-foreground">
              {t('report.memberFilter.title')}
            </span>
          </div>

          <div className="flex w-full flex-col gap-1 overflow-y-auto px-2 py-2">
            {/* All Members Option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selectedMemberId === null
                  ? 'bg-primary/10 font-medium text-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                <PiUsersBold size={12} />
              </div>
              <span className="flex-1 truncate text-body">
                {t('report.memberFilter.allMembers')}
              </span>
              {selectedMemberId === null && (
                <PiCheckBold size={12} className="shrink-0 text-primary" />
              )}
            </button>

            {/* Individual Members Options */}
            {availableMembers.length === 0 ? (
              <div className="mx-2 my-1 rounded-xl bg-muted px-3 py-4 text-center text-label text-muted-foreground">
                {t('report.memberFilter.empty')}
              </div>
            ) : (
              availableMembers.map((member) => {
                const isSelected = selectedMemberId === member.id
                const isDeleted = isDeletedUser(member)

                return (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSelect(member.id)}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSelected
                        ? 'bg-primary/10 font-medium text-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Avatar
                      src={member.avatarUrl}
                      name={member.name}
                      size="sm"
                      className="h-6 w-6 shrink-0 bg-content2 text-label"
                    />
                    <span
                      className={`flex-1 truncate text-body ${
                        isDeleted ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {member.name}
                    </span>
                    {isSelected && (
                      <PiCheckBold
                        size={12}
                        className="shrink-0 text-primary"
                      />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
