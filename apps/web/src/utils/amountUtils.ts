export type RoundMode = 'ceil' | 'round' | 'floor' | 'none'

export interface AmountFormatOptions {
  roundMode?: RoundMode
  decimals?: number
  currencyPosition?: 'prefix' | 'suffix'
}

/**
 * 統一金額顯示與格式化工具函式
 * @param amount 欲格式化的數值
 * @param currency 貨幣代碼或符號 (例如 'TWD', 'NT$', null)
 * @param options 進位選項與對齊設定
 */
export function formatAmount(
  amount: number,
  currency?: string | null,
  options?: AmountFormatOptions
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    const zeroStr = '0'
    if (currency) {
      return options?.currencyPosition === 'prefix'
        ? `${currency} ${zeroStr}`
        : `${zeroStr} ${currency}`
    }
    return zeroStr
  }

  const roundMode = options?.roundMode ?? 'none'
  const currencyPosition = options?.currencyPosition ?? 'suffix'

  let targetValue = amount
  let maximumFractionDigits = options?.decimals ?? 2

  if (roundMode === 'ceil') {
    targetValue = Math.ceil(amount)
    maximumFractionDigits = 0
  } else if (roundMode === 'floor') {
    targetValue = Math.floor(amount)
    maximumFractionDigits = 0
  } else if (roundMode === 'round') {
    targetValue = Math.round(amount)
    maximumFractionDigits = 0
  }

  const formattedNumber = targetValue.toLocaleString('en-US', {
    maximumFractionDigits,
  })

  if (currency) {
    return currencyPosition === 'prefix'
      ? `${currency} ${formattedNumber}`
      : `${formattedNumber} ${currency}`
  }

  return formattedNumber
}
