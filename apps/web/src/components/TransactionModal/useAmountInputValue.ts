import { useEffect, useRef, useState } from 'react'

type UseAmountInputValueParams = {
  amount: number
  onAmountChange: (nextAmount: number) => void
}

const amountPattern = /^\d*\.?\d*$/

function formatAmountValue(amount: number): string {
  if (!Number.isFinite(amount)) {
    return '0'
  }

  return amount.toString()
}

export function useAmountInputValue({
  amount,
  onAmountChange,
}: UseAmountInputValueParams) {
  const [inputValue, setInputValue] = useState(() => formatAmountValue(amount))
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (isFocusedRef.current) {
      return
    }

    setInputValue(formatAmountValue(amount))
  }, [amount])

  function handleChange(rawValue: string) {
    const normalizedValue = rawValue.replaceAll(',', '').trim()

    if (!amountPattern.test(normalizedValue)) {
      return
    }

    setInputValue(normalizedValue)

    if (!normalizedValue || normalizedValue === '.') {
      onAmountChange(0)
      return
    }

    const nextAmount = Number.parseFloat(normalizedValue)

    if (!Number.isNaN(nextAmount)) {
      onAmountChange(nextAmount)
    }
  }

  function handleClear() {
    setInputValue('')
    onAmountChange(0)
  }

  function handleFocus() {
    isFocusedRef.current = true
  }

  function handleBlur() {
    isFocusedRef.current = false
    setInputValue(formatAmountValue(amount))
  }

  return {
    inputValue,
    handleBlur,
    handleChange,
    handleClear,
    handleFocus,
  }
}