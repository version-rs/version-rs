import rss from '@astrojs/rss'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts'

export async function GET(context) {
  let releases = []
  try {
    const fs = await import('node:fs')
    const path = await import('node:path')
    const jsonPath = path.resolve(process.cwd(), 'src/data/releases.json')
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf-8')
      const parsed = JSON.parse(raw)
      releases = parsed.releases || []
    }
  } catch (e) {
    console.log('No releases.json found')
  }

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: releases.map(release => ({
      title: `Rust ${release.version} Released`,
      description: release.changelog_md ? release.changelog_md.slice(0, 500) : '',
      pubDate: new Date(release.date),
      link: `/v/${release.version}/`,
    })),
    customData: `<language>en-us</language>`,
  })
}
