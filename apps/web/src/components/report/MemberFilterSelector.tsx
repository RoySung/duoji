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
                className="w-4 h-4 text-tiny shrink-0"
              />
            ) : (
              <PiUserBold size={14} className="shrink-0" />
            )
          }
          className="bg-accent/60 text-foreground min-w-[7rem]"
        >
          {selectedMember
            ? t('report.memberFilter.triggerSelected', { name: selectedMember.name })
            : t('report.memberFilter.trigger')}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[min(18rem,calc(100vw-1rem))] rounded-[1.35rem] border border-border/80 bg-card p-0 shadow-[0_18px_44px_-30px_rgba(15,23,42,0.24)]">
        <div className="flex w-full max-h-[min(24rem,calc(100vh-4.5rem))] flex-col overflow-hidden">
          <div className="w-full border-b border-border/60 px-4 pb-3 pt-4 sm:px-5 text-left">
            <span className="text-[15px] font-semibold text-foreground">
              {t('report.memberFilter.title')}
            </span>
          </div>

          <div className="w-full flex flex-col gap-1 overflow-y-auto px-2 py-2">
            {/* All Members Option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70 ${
                selectedMemberId === null
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'hover:bg-muted/30 text-foreground'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-content2 text-muted-foreground">
                <PiUsersBold size={14} />
              </div>
              <span className="flex-1 truncate text-sm">
                {t('report.memberFilter.allMembers')}
              </span>
              {selectedMemberId === null && (
                <PiCheckBold size={14} className="text-primary shrink-0" />
              )}
            </button>

            {/* Individual Members Options */}
            {availableMembers.length === 0 ? (
              <div className="mx-2 my-1 rounded-xl border border-dashed border-border px-3 py-4 text-xs text-muted-foreground text-center">
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
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70 ${
                      isSelected
                        ? 'bg-primary/10 text-foreground font-medium'
                        : 'hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <Avatar
                      src={member.avatarUrl}
                      name={member.name}
                      size="sm"
                      className="w-6 h-6 text-tiny shrink-0 bg-content2"
                    />
                    <span
                      className={`flex-1 truncate text-sm ${
                        isDeleted ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {member.name}
                    </span>
                    {isSelected && (
                      <PiCheckBold size={14} className="text-primary shrink-0" />
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
