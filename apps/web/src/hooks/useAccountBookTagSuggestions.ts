import { useMemo } from 'react'

// For now, we only use local storage to cache tag suggestions.
export function getAccountBookTagsFromCache(
  accountBookId: string | null
): string[] {
  if (!accountBookId) return []
  const key = `duoji_tag_suggestions_${accountBookId}`
  try {
    const cached = localStorage.getItem(key)
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    return []
  }
}

export function saveAccountBookTagsToCache(
  accountBookId: string | null,
  tags: string[]
): void {
  if (!accountBookId) return
  const key = `duoji_tag_suggestions_${accountBookId}`
  try {
    const existingTags = getAccountBookTagsFromCache(accountBookId)
    const cleanedTags = tags.map((t) => t.trim()).filter(Boolean)
    const seen = new Set<string>()
    const merged: string[] = []

    for (const tag of [...existingTags, ...cleanedTags]) {
      const lower = tag.toLowerCase()
      if (!seen.has(lower)) {
        seen.add(lower)
        merged.push(tag)
      }
    }

    localStorage.setItem(key, JSON.stringify(merged))
  } catch (error) {
    // Ignore write failures gracefully
  }
}

function normalizeTagKey(tag: string) {
  return tag.trim().toLocaleLowerCase()
}

function compareTags(left: string, right: string) {
  return (
    left.localeCompare(right, undefined, { sensitivity: 'base' }) ||
    left.localeCompare(right)
  )
}

function filterSelectedTags(
  allTags: string[],
  selectedTags: string[]
): string[] {
  const selectedKeys = new Set(selectedTags.map(normalizeTagKey))
  const seenKeys = new Set<string>()
  const uniqueTags: string[] = []

  for (const tag of allTags) {
    const trimmed = tag.trim()
    if (!trimmed) {
      continue
    }
    const key = normalizeTagKey(trimmed)
    if (selectedKeys.has(key) || seenKeys.has(key)) {
      continue
    }
    seenKeys.add(key)
    uniqueTags.push(trimmed)
  }

  return uniqueTags.sort(compareTags)
}

export function useAccountBookTagSuggestions(
  accountBookId: string | null,
  selectedTags: string[] = []
) {
  const suggestions = useMemo(() => {
    const cachedTags = getAccountBookTagsFromCache(accountBookId)
    return filterSelectedTags(cachedTags, selectedTags)
  }, [accountBookId, selectedTags])

  return {
    suggestions,
  }
}
