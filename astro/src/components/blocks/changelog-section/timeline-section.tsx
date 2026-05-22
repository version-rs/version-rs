import TimelineItem from '@/components/timeline/timeline-items'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import BadgeAccordion from '@/components/badge-accordion/badge-accordion'
import { parseChangelog, convertInlineMarkdown } from '@/lib/changelog'

type Release = {
  version: string
  date: string
  is_unreleased?: boolean
  changelog_md: string
  release_name?: string
  issues?: Array<{
    title: string
    number: number
    html_url: string
    days_ago: number
  }>
}

function TimelineSection({ releases }: { releases: Release[] }) {
  const topReleases = releases.slice(-10).reverse()
  const latestStable = topReleases.find(r => !r.is_unreleased)?.version

  return (
    <section>
      <div className='mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16'>
        <h2 className='text-2xl font-semibold mb-8'>Recent Releases</h2>
        <div className='flex flex-col items-start'>
          {topReleases.map((release) => {
            const categorized = parseChangelog(release.changelog_md)
            return (
              <TimelineItem key={release.version} date={release.date} version={release.version}>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <a href={`/v/${release.version}`} className='text-lg font-semibold hover:underline'>
                      Version {release.version}
                    </a>
                    {release.is_unreleased && release.release_name === 'nightly' && (
                      <Badge variant='outline' className='text-xs bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border-purple-600/20 dark:border-purple-400/20'>
                        Nightly
                      </Badge>
                    )}
                    {release.is_unreleased && release.release_name === 'beta' && (
                      <Badge variant='outline' className='text-xs bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border-amber-600/20 dark:border-amber-400/20'>
                        Beta
                      </Badge>
                    )}
                    {!release.is_unreleased && release.version === latestStable && (
                      <Badge variant='outline' className='text-xs bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border-emerald-600/20 dark:border-emerald-400/20'>
                        Stable
                      </Badge>
                    )}
                    {release.is_unreleased && release.release_name !== 'nightly' && release.release_name !== 'beta' && (
                      <Badge variant='destructive' className='text-xs'>
                        Upcoming
                      </Badge>
                    )}
                  </div>

                  {/* Categorized changelog sections */}
                  {categorized.length > 0 && (
                    <BadgeAccordion data={categorized} />
                  )}

                  {/* Merged PRs for unreleased versions */}
                  {release.issues && release.issues.length > 0 && (
                    <Card className='mt-2'>
                      <CardContent className='p-3 text-sm'>
                        <p className='font-medium mb-1'>Merged PRs:</p>
                        <ul className='list-disc list-inside space-y-1'>
                          {release.issues.slice(0, 5).map((issue) => (
                            <li key={issue.number}>
                              <a href={issue.html_url} target='_blank' rel='noopener noreferrer' className='hover:underline' dangerouslySetInnerHTML={{ __html: convertInlineMarkdown(issue.title) }} />
                              <span className='text-muted-foreground text-xs'> ({issue.days_ago}d ago)</span>
                            </li>
                          ))}
                          {release.issues.length > 5 && (
                            <li className='text-muted-foreground text-xs'>+{release.issues.length - 5} more</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  <a href={`/v/${release.version}`} className='text-sm text-muted-foreground hover:underline mt-1 inline-block'>
                    View details →
                  </a>
                </div>
              </TimelineItem>
            )
          })}
        </div>
      </div>
      <div className='text-center mt-8'>
        <a href='/versions' className='text-muted-foreground hover:text-primary text-sm underline underline-offset-2'>
          Browse all {releases.length} releases →
        </a>
      </div>
    </section>
  )
}

export default TimelineSection
