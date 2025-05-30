import React, { useState, KeyboardEvent, useEffect } from 'react'
import { Chip, Input, InputProps } from '@heroui/react'
import clsx from 'clsx'

interface TagsInputProps extends InputProps {
  onTagsChange?: (tags: string[]) => void
  data: {
    keywords?: string[] | null
  }
}

const validateTagContent = (tag: string): boolean => {
  const regex = /^[a-zA-Z0-9\s]+$/
  return regex.test(tag.trim())
}

const TagsInput: React.FC<TagsInputProps> = ({
  data,
  onTagsChange,
  ...rest
}) => {
  const [tags, setTags] = React.useState<string[]>(
    data?.keywords ? data?.keywords : data?.keywords || []
  )
  const [inputValue, setInputValue] = useState<string>('')
  const [isInvalid, setIsInvalid] = useState(false)

  useEffect(() => {
    const hasInvalidContent = tags.some((tag) => !validateTagContent(tag))
    setIsInvalid(hasInvalidContent)
  }, [inputValue, tags])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      e.preventDefault()
      const trimmedValue = inputValue.trim()

      if (trimmedValue && !tags.includes(trimmedValue)) {
        const newTags = [...tags, trimmedValue]
        setTags(newTags)

        if (onTagsChange) onTagsChange(newTags)

        setInputValue('')
      }
    }

    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const updatedTags = Array.from(
        new Set(tags.map((t) => t.trim().toLowerCase()))
      )
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

  return (
    <div className={clsx(rest.className, 'flex flex-wrap items-center gap-2')}>
      <Input
        {...rest}
        className={clsx('flex-grow')}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Tab, Enter or ','"
        isClearable={false}
        isInvalid={isInvalid}
      />
      {tags.map((tag, index) => (
        <Chip
          key={index}
          className="flex p-2 mb-1"
          onClose={() => handleRemoveTag(index)}
        >
          {tag}
        </Chip>
      ))}
      {isInvalid && (
        <span className="text-red-500 text-sm">
          Duplicate tags are not allowed. Please remove duplicates.
        </span>
      )}
    </div>
  )
}

export default TagsInput
