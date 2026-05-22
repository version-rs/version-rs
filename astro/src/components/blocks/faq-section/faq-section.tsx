import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqItems = [
  {
    question: 'How often is version.rs updated?',
    answer: 'Data is updated on-demand when the developer runs the data pipeline and commits fresh JSON. There is no automated cron job — updates happen when new Rust releases are published or stabilization PRs change.'
  },
  {
    question: 'Where does the data come from?',
    answer: 'Release data comes from the official rust-lang/rust repository\'s RELEASES.md file. Milestone and stabilization PR data comes from the GitHub API. All data is fetched by a Rust CLI tool that runs locally.'
  },
  {
    question: 'What is the release cycle for Rust?',
    answer: 'Rust follows a 6-week release cycle. A new stable version is released every 6 weeks, with beta and nightly versions tracking ahead. The exact dates are calculated from Rust\'s first stable release on December 10, 2015.'
  },
  {
    question: 'Is this project open source?',
    answer: 'Yes! version.rs is open source under the MIT license. You can find the source code on GitHub.'
  }
]

const FAQ = () => {
  return (
    <section className='py-8 sm:py-10 lg:py-16'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Need Help? We&apos;ve Got Answers</h2>
          <p className='text-muted-foreground text-xl'>Explore our most commonly asked questions.</p>
        </div>
        <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className='text-lg'>{item.question}</AccordionTrigger>
              <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ
