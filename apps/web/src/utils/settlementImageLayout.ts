import type { SettlementImageReport } from './settlementImageReport'

export const reportWidth = 448
export const reportGutter = 24
const cardPadding = 24
const cardWidth = reportWidth - reportGutter * 2
const contentWidth = cardWidth - cardPadding * 2

const colors = {
  background: 'hsl(45 22% 96%)',
  card: '#ffffff',
  ink: 'hsl(169 22% 16%)',
  muted: 'hsl(163 9% 38%)',
  inset: 'hsl(150 13% 94%)',
  border: 'hsl(40 10% 85%)',
  primary: 'hsl(166 21% 34%)',
  positive: '#15803d',
  negative: '#b91c1c',
  complete: '#dcfce7',
  pending: '#fef3c7',
  warning: '#92400e',
}

const fontFamily = 'jf-openhuninn'
const fallbackFamily = 'system-ui, sans-serif'

type Style = { size: number; color: string; weight: number }
const headline = { size: 24, color: colors.ink, weight: 600 }
const title = { size: 18, color: colors.ink, weight: 600 }
const body = { size: 14, color: colors.ink, weight: 400 }
const strong = { ...body, weight: 600 }
const label = { size: 12, color: colors.muted, weight: 400 }

type Text = {
  value: string
  x: number
  style: Style
  align?: 'right'
  chip?: string
}
type ReportLine = { height: number; text: Text[]; inset?: boolean }
type ReportRow = { lines: ReportLine[] }
export type ReportSection = { heading?: ReportLine; rows: ReportRow[] }

const lineHeight = (style: Style) => Math.ceil(style.size * 1.4)
const font = (style: Style, family: string) =>
  `${style.weight} ${style.size}px ${family}`

function wrapText(
  value: string,
  width: number,
  measure: (text: string) => number
) {
  const lines: string[] = []
  for (const paragraph of value.split(/\r\n?|\n/u)) {
    let line = ''
    // Keep words together where possible and fall back to code points for long tokens.
    for (const word of paragraph.match(/\s+|[^\s]+/gu) ?? []) {
      if (measure(line + word) <= width) {
        line += word
        continue
      }
      if (line.trim()) lines.push(line.trimEnd())
      line = word.trimStart()
      if (measure(line) <= width) continue

      const token = line
      line = ''
      const graphemes =
        typeof Intl.Segmenter === 'function'
          ? Array.from(
              new Intl.Segmenter().segment(token),
              ({ segment }) => segment
            )
          : Array.from(token)
      for (const character of graphemes) {
        if (line && measure(line + character) > width) {
          lines.push(line)
          line = ''
        }
        line += character
      }
    }
    lines.push(line.trimEnd())
  }
  return lines
}

export function layoutSettlementImage(
  report: SettlementImageReport,
  ctx: CanvasRenderingContext2D,
  family: string
): ReportSection[] {
  const { t } = report
  const detail = (key: string) => t(`settlement.detail.${key}`)
  const image = (key: string, values?: Record<string, string | number>) =>
    t(`settlement.image.${key}`, values)
  const textWidth = (value: string, style: Style) => {
    ctx.font = font(style, family)
    return ctx.measureText(value).width
  }

  function columns(
    cells: {
      value: string
      style: Style
      x: number
      width: number
      align?: 'right'
    }[],
    gap = 0
  ): ReportLine[] {
    const wrapped = cells.map((cell) =>
      wrapText(cell.value, cell.width, (value) => textWidth(value, cell.style))
    )
    const height = Math.max(...cells.map(({ style }) => lineHeight(style)))
    return Array.from(
      { length: Math.max(...wrapped.map(({ length }) => length)) },
      (_, index) => ({
        height: height + (index === 0 ? gap : 0),
        text: cells.flatMap(({ x, style, align }, column) => {
          const value = wrapped[column][index]
          return value === undefined ? [] : [{ value, x, style, align }]
        }),
      })
    )
  }

  const single = (value: string, style = body, gap = 0) =>
    columns([{ value, style, x: 0, width: contentWidth }], gap)
  const duo = (
    left: string,
    right: string,
    leftStyle: Style,
    rightStyle: Style,
    gap = 0
  ) => {
    const rightWidth = Math.min(
      contentWidth * 0.44,
      textWidth(right, rightStyle)
    )
    return columns(
      [
        {
          value: left,
          style: leftStyle,
          x: 0,
          width: contentWidth - rightWidth - 12,
        },
        {
          value: right,
          style: rightStyle,
          x: contentWidth,
          width: rightWidth,
          align: 'right',
        },
      ],
      gap
    )
  }

  function badge(
    value: string,
    x: number,
    complete: boolean,
    align?: 'right'
  ): Text {
    return {
      value,
      x,
      align,
      style: {
        ...label,
        color: complete ? colors.positive : colors.warning,
        weight: 600,
      },
      chip: complete ? colors.complete : colors.pending,
    }
  }

  function heading(value: string, right?: string): ReportLine {
    return {
      height: lineHeight(title),
      text: [
        { value, x: 0, style: title },
        ...(right
          ? [
              {
                value: right,
                x: cardWidth,
                style: label,
                align: 'right' as const,
              },
            ]
          : []),
      ],
    }
  }

  const meta: ReportLine = {
    height: 34,
    text: [
      { value: report.date, x: 0, style: label },
      ...(report.completed === null
        ? []
        : [
            badge(
              detail(report.completed ? 'settled' : 'pending'),
              textWidth(report.date, label) + 20,
              report.completed
            ),
          ]),
    ],
  }
  const header = {
    rows: [
      {
        lines: [
          ...single('Duoji', { ...strong, color: colors.primary }),
          ...single(report.title, headline, 8),
          meta,
        ],
      },
    ],
  }

  const members = report.members.map((member) => {
    const column = (contentWidth - 40) / 3
    const balanceLabel =
      member.direction === 'settled'
        ? report.completed === null
          ? t('settlement.markdown.content.tableHeaderBalance')
          : detail('settled')
        : detail(member.direction === 'receivable' ? 'toReceive' : 'toPay')
    const balanceStyle = {
      ...strong,
      color:
        member.direction === 'receivable'
          ? colors.positive
          : member.direction === 'payable'
          ? colors.negative
          : colors.ink,
    }
    const insetColumns = (values: string[], styles: Style[]) =>
      columns(
        values.map((value, index) => ({
          value,
          style: styles[index],
          x: 12 + index * (column + 8),
          width: column,
        }))
      ).map((line) => ({ ...line, inset: true }))
    return {
      lines: [
        ...single(member.name, strong),
        { height: 12, text: [] },
        { height: 12, text: [], inset: true },
        ...insetColumns(
          [detail('split'), detail('paid'), balanceLabel],
          [label, label, label]
        ),
        ...insetColumns(
          [member.split, member.paid, member.balance],
          [strong, strong, balanceStyle]
        ),
        { height: 12, text: [], inset: true },
      ],
    }
  })

  const transfers = report.transfers.map((transfer) => {
    const status =
      transfer.completed === null
        ? null
        : badge(
            detail(transfer.completed ? 'done' : 'pending'),
            contentWidth,
            transfer.completed,
            'right'
          )
    const direction = columns([
      {
        value: transfer.direction,
        style: strong,
        x: 0,
        width: status
          ? contentWidth - textWidth(status.value, status.style) - 28
          : contentWidth,
      },
    ])
    if (status) {
      direction[0].height = Math.max(direction[0].height, 24)
      direction[0].text.push(status)
    }
    return {
      lines: [
        ...direction,
        ...duo(image('suggested'), transfer.suggested, label, title, 8),
        ...(transfer.actual === null
          ? []
          : duo(image('actual'), transfer.actual, label, strong, 8)),
        ...(transfer.note
          ? single(image('note', { note: transfer.note }), label, 8)
          : []),
      ],
    }
  })

  const wallet = report.wallet
  const walletSections = wallet
    ? [
        {
          heading: heading(t('settlement.sharedWallet.title')),
          rows: [
            {
              lines: [
                ...duo(
                  t('settlement.sharedWallet.total'),
                  wallet.total,
                  body,
                  strong
                ),
                ...duo(
                  t('settlement.sharedWallet.average'),
                  wallet.average,
                  body,
                  strong,
                  8
                ),
              ],
            },
            ...(wallet.borrowings.length
              ? [
                  {
                    lines: [
                      ...single(
                        t('settlement.sharedWallet.borrowings'),
                        strong
                      ),
                      ...wallet.borrowings.flatMap(({ name, amount }) =>
                        duo(name, `−${amount}`, body, strong, 8)
                      ),
                    ],
                  },
                ]
              : []),
          ],
        },
      ]
    : []

  const expenses = report.expenses.map((expense) => ({
    lines: [
      ...duo(expense.description, expense.amount, strong, strong),
      ...single(`${expense.date} · ${expense.category}`, label, 8),
      ...single(
        image('paidBy', {
          names: expense.payers.join(image('listSeparator')) || image('none'),
        }),
        body,
        8
      ),
      ...single(
        image('splitWith', {
          names: expense.splits.join(image('listSeparator')) || image('none'),
        }),
        body,
        8
      ),
    ],
  }))
  return [
    header,
    {
      heading: heading(t('settlement.confirm.balances')),
      rows: members.length ? members : [{ lines: single(image('noMembers')) }],
    },
    {
      heading: heading(
        report.completed === null
          ? t('settlement.confirm.transfers')
          : detail('transfers')
      ),
      rows: transfers.length
        ? transfers
        : [{ lines: single(detail('noTransfers')) }],
    },
    ...walletSections,
    {
      heading: heading(
        image('expenses'),
        image('expenseCount', { count: expenses.length })
      ),
      rows: expenses.length
        ? expenses
        : [{ lines: single(image('noExpenses')) }],
    },
  ]
}

const rowPadding = 24
const headingGap = 12
const sectionGap = 32
const rowHeight = (row: ReportRow) =>
  row.lines.reduce((height, line) => height + line.height, rowPadding * 2)
const sectionHeight = (section: ReportSection) =>
  section.rows.reduce(
    (height, row) => height + rowHeight(row),
    section.heading ? section.heading.height + headingGap : 0
  )
export const settlementImageHeight = (sections: ReportSection[]) =>
  sections.reduce(
    (height, section, index) =>
      height + sectionHeight(section) + (index ? sectionGap : 0),
    reportGutter * 2
  )

function paintCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string,
  border = false
) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
  ctx.fillStyle = fill
  ctx.fill()
  if (border) {
    ctx.strokeStyle = colors.border
    ctx.stroke()
  }
}

export function paintSettlementImage(
  ctx: CanvasRenderingContext2D,
  sections: ReportSection[],
  height: number,
  family: string,
  top = 0,
  bottom = height
) {
  ctx.fillStyle = colors.background
  ctx.fillRect(0, top, reportWidth, bottom - top)
  ctx.textBaseline = 'middle'
  // Keep glyphs and chip borders that extend past a line's layout box.
  const visibleTop = top - headline.size
  const visibleBottom = bottom + headline.size

  const drawText = (text: Text, x: number, y: number) => {
    const left = x + text.x
    ctx.font = font(text.style, family)
    ctx.textAlign = text.align ?? 'left'
    if (text.chip) {
      const padding = 8
      const width = ctx.measureText(text.value).width + padding * 2
      const chipX = text.align === 'right' ? left - width : left
      paintCard(ctx, chipX, y - 10, width, 20, 10, text.chip)
      x += text.align === 'right' ? -padding : padding
    }
    ctx.fillStyle = text.style.color
    ctx.fillText(text.value, x + text.x, y)
  }

  let y = reportGutter
  for (const section of sections) {
    if (y > visibleBottom) break
    if (section.heading) {
      if (y + section.heading.height >= visibleTop) {
        for (const text of section.heading.text) {
          drawText(text, reportGutter, y + section.heading.height / 2)
        }
      }
      y += section.heading.height + headingGap
    }
    const cardHeight = section.rows.reduce(
      (sum, row) => sum + rowHeight(row),
      0
    )
    if (y + cardHeight < visibleTop) {
      y += cardHeight + sectionGap
      continue
    }
    paintCard(
      ctx,
      reportGutter,
      y,
      cardWidth,
      cardHeight,
      16,
      colors.card,
      true
    )

    for (const [rowIndex, row] of section.rows.entries()) {
      if (y > visibleBottom) break
      const height = rowHeight(row)
      if (y + height < visibleTop) {
        y += height
        continue
      }
      const x = reportGutter + cardPadding
      if (rowIndex > 0) {
        ctx.fillStyle = colors.border
        ctx.fillRect(x, y, contentWidth, 1)
      }
      y += rowPadding
      const firstInset = row.lines.findIndex((line) => line.inset)
      if (firstInset >= 0) {
        const insetY = row.lines
          .slice(0, firstInset)
          .reduce((sum, line) => sum + line.height, y)
        const insetHeight = row.lines.reduce(
          (sum, line) => sum + (line.inset ? line.height : 0),
          0
        )
        paintCard(ctx, x, insetY, contentWidth, insetHeight, 12, colors.inset)
      }
      for (const line of row.lines) {
        if (y <= visibleBottom && y + line.height >= visibleTop) {
          for (const text of line.text) {
            drawText(text, x, y + line.height - lineHeight(text.style) / 2)
          }
        }
        y += line.height
      }
      y += rowPadding
    }
    y += sectionGap
  }
}

export async function resolveSettlementFont() {
  if (!document.fonts) return fallbackFamily
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    const result = await Promise.race([
      document.fonts.load(`14px "${fontFamily}"`, '結算 Duoji'),
      new Promise<null>((resolve) => {
        timeout = setTimeout(() => resolve(null), 1500)
      }),
    ])
    return result?.length
      ? `"${fontFamily}", ${fallbackFamily}`
      : fallbackFamily
  } catch {
    return fallbackFamily
  } finally {
    clearTimeout(timeout)
  }
}
