import { PiArrowRightBold, PiReceiptBold } from 'react-icons/pi'
import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { SettlementRecord } from '@/entities/settlement'

type Props = {
  records: SettlementRecord[]
  onSelectRecord: (recordId: string) => void
}

export default function SettlementRecordList({
  records,
  onSelectRecord,
}: Props) {
  const t = useTranslations()
  // Newest first for display; sequence number = position in chronological order
  const sorted = [...records].sort((a, b) => b.createdAt - a.createdAt)

  if (sorted.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-border bg-background px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-400/15 text-orange-300">
          <PiReceiptBold size={22} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {t('settlement.list.emptyTitle')}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('settlement.list.emptyDescription')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sorted.map((record, index) => {
        const sequenceNumber = sorted.length - index
        const date = new Date(record.createdAt).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        const completedCount = record.transfers.filter(
          (t) => t.status === 'completed'
        ).length
        const isCompleted = completedCount === record.transfers.length

        return (
          <button
            key={record.id}
            className="block w-full rounded-2xl border border-border bg-background px-4 py-4 text-left transition hover:border-orange-200 hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/70"
            type="button"
            onClick={() => onSelectRecord(record.id)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold text-foreground">
                    {t('settlement.detail.title', { sequenceNumber })}
                  </p>
                  <Chip
                    className={
                      isCompleted
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }
                    size="sm"
                    variant="flat"
                  >
                    {isCompleted
                      ? t('settlement.detail.settled')
                      : t('settlement.detail.pending')}
                  </Chip>
                </div>
                <p className="text-sm text-muted-foreground">{date}</p>
                <p className="text-xs text-muted-foreground">
                  {t('settlement.list.transfersDone', { completedCount, totalCount: record.transfers.length })}
                </p>
              </div>
              <PiArrowRightBold className="shrink-0 text-muted-foreground" />
            </div>
          </button>
        )
      })}
    </div>
  )
}
