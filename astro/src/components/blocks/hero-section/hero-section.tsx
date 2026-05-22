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
      </div>
    </section>
  )
}

export default HeroSection
