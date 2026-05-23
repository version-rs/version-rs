import { Badge } from '@/components/ui/badge'

function HeroSection() {
  return (
    <section id='home' className='-mt-17.5 pt-17.5'>
      <div className='space-y-4 px-4 py-8 text-center md:px-8 md:py-16'>
        <Badge className='text-sm font-normal' variant='outline'>
          Rust Release Tracker
        </Badge>
        <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>version.rs</h2>
        <p className='text-muted-foreground text-xl'>Track Rust compiler releases, changelogs, and upcoming milestones.</p>
        <div className='flex justify-center gap-3 mt-4'>
          <a href='/stable'>
            <Badge className='text-base px-4 py-1.5 font-normal bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border-emerald-600/20 dark:border-emerald-400/20 transition-all duration-200 hover:scale-105 hover:brightness-125' title="Link to latest stable release">Stable</Badge>
          </a>
          <a href='/beta'>
            <Badge className='text-base px-4 py-1.5 font-normal bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border-amber-600/20 dark:border-amber-400/20 transition-all duration-200 hover:scale-105 hover:brightness-125' title="Link to latest beta release">Beta</Badge>
          </a>
          <a href='/nightly'>
            <Badge className='text-base px-4 py-1.5 font-normal bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border-purple-600/20 dark:border-purple-400/20 transition-all duration-200 hover:scale-105 hover:brightness-125' title="Link to latest nightly release">Nightly</Badge>
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
