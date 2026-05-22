import type { CategorizedChange } from '@/components/badge-accordion/badge-accordion'

const CATEGORY_MAP: Record<string, CategorizedChange['type']> = {
  // Language
  language: 'language',
  'language updates': 'language',

  // Compiler
  compiler: 'compiler',
  diagnostics: 'compiler',
  'compile-time optimizations': 'compiler',
  'compile time optimizations': 'compiler',
  rustc: 'compiler',

  // Libraries
  libraries: 'libraries',
  'stabilized apis': 'libraries',
  stabilized: 'libraries',

  // Cargo / Tooling
  cargo: 'cargo',
  tooling: 'cargo',

  // Performance
  performance: 'performance',

  // Fixes
  fixed: 'fixes',
  fixes: 'fixes',
  'bug fixes': 'fixes',
  'bugfixes': 'fixes',
  'bug fix': 'fixes',
  'regression fixes': 'fixes',

  // Breaking / Compatibility
  'breaking changes': 'breaking',
  'breaking': 'breaking',
  'compatibility notes': 'breaking',

  // Other
  highlights: 'other',
  usability: 'other',
  misc: 'other',
  miscellaneous: 'other',
  rustdoc: 'other',
  documentation: 'other',
  internal: 'other',
  'internal changes': 'other',
  'internal improvements': 'other',
  'platform support': 'other',
  added: 'other',
  changed: 'other',
  changes: 'other',
  removed: 'other',
  deprecations: 'other',
  deprecated: 'other',
  updates: 'other',
  improvements: 'other',
  features: 'other',
  'new features': 'other',
}

function categorizeHeading(heading: string): CategorizedChange['type'] {
  const key = heading.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
  return CATEGORY_MAP[key] || CATEGORY_MAP[key.replace(/s$/, '')] || 'other'
}

/**
 * Parse a Rust RELEASES.md changelog string into categorized sections.
 *
 * Handles both ATX (## Language) and setext (Language\n--------) heading formats.
 */
export function parseChangelog(md: string): CategorizedChange[] {
  if (!md || md.trim().length === 0) return []

  const sections = splitIntoSections(md)

  if (sections.length === 0) {
    const items = extractListItems(md)
    if (items.length > 0) {
      return [{ type: 'other', items }]
    }
    return []
  }

  const grouped: Record<string, string[]> = {
    language: [], compiler: [], libraries: [], cargo: [],
    performance: [], fixes: [], breaking: [], other: [],
  }

  for (const section of sections) {
    if (!section.body) continue
    const items = extractListItems(section.body)
    if (items.length === 0) continue
    const category = categorizeHeading(section.heading)
    if (grouped[category]) {
      grouped[category].push(...items)
    } else {
      grouped.other.push(...items)
    }
  }

  return (Object.entries(grouped) as [string, string[]][])
    .filter(([_, items]) => items.length > 0)
    .map(([type, items]) => ({ type: type as CategorizedChange['type'], items }))
}

/**
 * Split markdown into sections by detecting headings.
 */
function splitIntoSections(md: string): Array<{ heading: string; body: string }> {
  const lines = md.split('\n')
  const sections: Array<{ heading: string; body: string; lineIndex: number }> = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    const atxMatch = trimmed.match(/^## (.+)$/)
    if (atxMatch) {
      sections.push({ heading: atxMatch[1].trim(), body: '', lineIndex: i })
      continue
    }

    if (i + 1 < lines.length) {
      const nextTrimmed = lines[i + 1].trim()
      if (/^[-]+$/.test(nextTrimmed) && trimmed.length > 0 && !trimmed.startsWith('<')) {
        sections.push({ heading: trimmed, body: '', lineIndex: i })
        continue
      }
    }
  }

  for (let i = 0; i < sections.length; i++) {
    const startLine = sections[i].lineIndex
    const endLine = i + 1 < sections.length ? sections[i + 1].lineIndex : lines.length
    const bodyLines = lines.slice(startLine + 1, endLine)
    const body = bodyLines
      .filter(l => !/^[-]+$/.test(l.trim()) && !l.trim().startsWith('<a'))
      .join('\n')
      .trim()
    sections[i].body = body
  }

  return sections.map(({ heading, body }) => ({ heading, body }))
}

function extractListItems(text: string): string[] {
  const items: string[] = []
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/)
    if (bulletMatch) {
      let item = bulletMatch[1].trim()
      item = convertInlineMarkdown(item)
      items.push(item)
    }
  }
  return items
}

/** Convert inline markdown (bold, code, links) to HTML */
export function convertInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">$1</a>')
}

/**
 * Render full markdown to HTML for the full changelog view.
 */
export function renderChangelogHtml(md: string): string {
  if (!md) return '<p>No changelog available.</p>'

  let html = md
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n{3,}/g, '\n\n')

  html = html.replace(/((?:<li>.*\n?)+)/g, '<ul>$1</ul>')

  const lines = html.split('\n')
  let result = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === '') continue
    if (trimmed.startsWith('<')) {
      result += trimmed + '\n'
    } else {
      result += '<p>' + trimmed + '</p>\n'
    }
  }

  return result
}
