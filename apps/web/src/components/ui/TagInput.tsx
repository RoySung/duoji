import React, {
  useId,
  useState,
  KeyboardEvent,
  useEffect,
  useMemo,
} from 'react'
import { Chip, InputProps } from '@heroui/react'
import clsx from 'clsx'

interface TagsInputProps
  extends Pick<
    InputProps,
    | 'autoComplete'
    | 'autoFocus'
    | 'className'
    | 'inputMode'
    | 'isDisabled'
    | 'isRequired'
    | 'label'
    | 'name'
    | 'onBlur'
    | 'onFocus'
    | 'placeholder'
  > {
  onTagsChange?: (tags: string[]) => void
  suggestions?: string[]
  data: {
    keywords?: string[] | null
  }
}

function normalizeTag(tag: string): string {
  return tag.trim().toLocaleLowerCase()
}

const TagsInput: React.FC<TagsInputProps> = ({
  autoComplete,
  autoFocus,
  className,
  data,
  inputMode,
  isDisabled,
  isRequired,
  label,
  name,
  onTagsChange,
  onBlur,
  onFocus,
  placeholder,
  suggestions = [],
}) => {
  const inputId = useId()
  const [tags, setTags] = React.useState<string[]>(
    data?.keywords ? data?.keywords : data?.keywords || []
  )
  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    setTags(data?.keywords ? [...data.keywords] : [])
  }, [data?.keywords])

  const visibleSuggestions = useMemo(() => {
    const selectedTags = new Set(tags.map(normalizeTag))

    return suggestions.filter((suggestion) => {
      const trimmedSuggestion = suggestion.trim()

      if (!trimmedSuggestion) {
        return false
      }

      return !selectedTags.has(normalizeTag(trimmedSuggestion))
    })
  }, [suggestions, tags])

  const addTag = (value: string) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return
    }

    if (tags.some((tag) => normalizeTag(tag) === normalizeTag(trimmedValue))) {
      setInputValue('')
      return
    }

    const newTags = [...tags, trimmedValue]
    setTags(newTags)
    onTagsChange?.(newTags)
    setInputValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    }

    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const updatedTags = tags.slice(0, -1)
      setTags(updatedTags)
      if (onTagsChange) onTagsChange(updatedTags)
    }
  }

  const handleRemoveTag = (index: number) => {
    const updatedTags = tags.filter((_, i) => i !== index)
    setTags(updatedTags)
    if (onTagsChange) onTagsChange(updatedTags)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue.trim()) {
      addTag(inputValue)
    }
    onBlur?.(e)
  }

  return (
    <div className={clsx(className, 'flex w-full flex-col gap-2')}>
      {label ? (
        <label
          className="text-body font-medium text-foreground"
          htmlFor={inputId}
        >
          {label}
          {isRequired ? <span className="ml-1 text-danger">*</span> : null}
        </label>
      ) : null}
      <div
        data-testid="tag-input-field"
        className={clsx(
          'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-large border border-default-200 bg-default-50 px-3 py-2 transition-colors',
          'focus-within:border-primary focus-within:bg-content1',
          isDisabled && 'cursor-not-allowed opacity-60'
        )}
      >
        {tags.map((tag, index) => (
          <Chip
            key={`${tag}-${index}`}
            className="max-w-full text-label"
            onClose={() => handleRemoveTag(index)}
          >
            {tag}
          </Chip>
        ))}
        <input
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          id={inputId}
          aria-label={typeof label === 'string' ? label : undefined}
          className="min-w-[8rem] flex-1 border-0 bg-transparent text-body outline-none placeholder:text-muted-foreground"
          disabled={isDisabled}
          inputMode={inputMode}
          name={name}
          onBlur={handleBlur}
          onChange={handleInputChange}
          onFocus={onFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? "Type and press Tab, Enter or ','"}
          value={inputValue}
        />
      </div>
      {visibleSuggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleSuggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              className="cursor-pointer text-label transition-colors hover:bg-default-300"
              onClick={() => addTag(suggestion)}
            >
              {suggestion}
            </Chip>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default TagsInput
