import { PiArrowRightBold, PiReceiptBold } from 'react-icons/pi'
import { Chip } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { SettlementRecord } from '@/entities/settlement'
import { SurfaceCard } from '@/components/ui/SurfaceCard'

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
      <SurfaceCard
        className="px-5 py-9 text-center"
        data-testid="settlement-records-empty-state"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-peach/70 text-emphasis-foreground dark:bg-peach/15 dark:text-peach-foreground">
          <PiReceiptBold size={18} />
        </div>
        <h3 className="mt-4 text-title font-semibold text-foreground">
          {t('settlement.list.emptyTitle')}
        </h3>
        <p className="mt-2 text-body text-muted-foreground">
          {t('settlement.list.emptyDescription')}
        </p>
      </SurfaceCard>
    )
  }

  return (
    <div className="space-y-3" data-testid="settlement-record-list">
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
          <article key={record.id}>
            <SurfaceCard className="overflow-hidden transition-colors hover:bg-card">
              <button
                className="block min-h-11 w-full rounded-2xl px-4 py-4 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                data-testid={`settlement-record-${record.id}`}
                type="button"
                onClick={() => onSelectRecord(record.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-col items-start gap-2 min-[360px]:flex-row min-[360px]:items-center">
                      <h2 className="break-words text-title font-semibold text-foreground">
                        {t('settlement.detail.title', { sequenceNumber })}
                      </h2>
                      <Chip
                        className={
                          isCompleted
                            ? 'bg-success/10 text-label text-success-700 dark:text-success-400'
                            : 'bg-warning/10 text-label text-warning-700 dark:text-warning-400'
                        }
                        size="sm"
                        variant="flat"
                      >
                        {isCompleted
                          ? t('settlement.detail.settled')
                          : t('settlement.detail.pending')}
                      </Chip>
                    </div>
                    <p className="text-body text-muted-foreground">{date}</p>
                    <p className="text-label leading-5 text-muted-foreground">
                      {t('settlement.list.transfersDone', {
                        completedCount,
                        totalCount: record.transfers.length,
                      })}
                    </p>
                  </div>
                  <PiArrowRightBold
                    aria-hidden
                    className="shrink-0 text-muted-foreground"
                    size={14}
                  />
                </div>
              </button>
            </SurfaceCard>
          </article>
        )
      })}
    </div>
  )
}
