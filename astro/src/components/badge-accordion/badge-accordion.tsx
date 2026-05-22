import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

type CategorizedChange = {
  type: 'language' | 'compiler' | 'libraries' | 'cargo' | 'performance' | 'fixes' | 'breaking' | 'other'
  items: string[]
}

type BadgeAccordionProps = {
  data: CategorizedChange[]
}

const BADGE_CONFIG: Record<CategorizedChange['type'], { className: string; label: string }> = {
  language: {
    className:
      'border-none h-6 rounded-sm bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400',
    label: 'Language',
  },
  compiler: {
    className:
      'border-none h-6 rounded-sm bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400',
    label: 'Compiler',
  },
  libraries: {
    className:
      'border-none h-6 rounded-sm bg-teal-600/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400',
    label: 'Libraries',
  },
  cargo: {
    className:
      'border-none h-6 rounded-sm bg-orange-600/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400',
    label: 'Cargo',
  },
  performance: {
    className:
      'border-none h-6 rounded-sm bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
    label: 'Performance',
  },
  fixes: {
    className:
      'border-none h-6 rounded-sm bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
    label: 'Fixes',
  },
  breaking: {
    className:
      'border-none h-6 rounded-sm bg-red-600/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',
    label: 'Breaking',
  },
  other: {
    className:
      'border-none h-6 rounded-sm bg-neutral-600/10 text-neutral-600 dark:bg-neutral-400/10 dark:text-neutral-400',
    label: 'Other',
  },
}

const allValues = (data: CategorizedChange[]) => data.map((_, i) => `item-${i}`)

const BadgeAccordion = ({ data }: BadgeAccordionProps) => {
  const [value, setValue] = useState<string[]>(() => allValues(data))

  if (!data || data.length === 0) return null

  const allOpen = data.every((_, i) => value?.includes(`item-${i}`))

  return (
    <div className='w-full min-w-[320px]'>
      <div className='flex justify-end mb-1'>
        <button
          onClick={() => setValue(allOpen ? [] : allValues(data))}
          className='text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
        >
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <Accordion type='multiple' value={value} onValueChange={setValue} className='-mt-4 mb-0 w-full'>
        {data.map((item, index) => {
          const badgeProps = BADGE_CONFIG[item.type]
          if (item.items.length === 0) return null

          return (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className='hover:no-underline [&>svg]:size-6'>
                <Badge className={badgeProps.className}>{badgeProps.label}</Badge>
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>
                <ul className='text-muted-foreground list-inside list-disc space-y-2 text-sm'>
                  {item.items.map((listItem, listIndex) => (
                    <li key={listIndex} dangerouslySetInnerHTML={{ __html: listItem }} />
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

export type { CategorizedChange }
export default BadgeAccordion
