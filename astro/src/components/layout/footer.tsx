import { GithubIcon } from 'lucide-react'
import Logo from '@/components/logo'

const Footer = () => {
  return (
    <footer>
      <div className='via-primary/20 mx-auto h-px w-4/5 bg-gradient-to-r from-transparent to-transparent'></div>
      <div className='mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-8 sm:py-6 md:gap-6 md:py-8'>
        <a href='/'>
          <Logo className='gap-3' />
        </a>
        <div className='flex items-center gap-5 whitespace-nowrap lg:gap-12'>
          <a href='/' className='text-muted-foreground hover:text-primary text-base! font-medium'>Home</a>
          <a href='/stabilizations' className='text-muted-foreground hover:text-primary text-base! font-medium'>Stabilizations</a>
          <a href='/upcoming' className='text-muted-foreground hover:text-primary text-base! font-medium'>Upcoming</a>
          <a href='/versions' className='text-muted-foreground hover:text-primary text-base! font-medium'>Versions</a>
        </div>
        <div className='flex items-center gap-4'>
          <a href='https://github.com/version-rs/version-rs' target='_blank'>
            <GithubIcon className='size-5' />
          </a>
        </div>
      </div>
      <div className='mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6'>
        <p className='text-center font-medium text-balance'>
          &copy;{new Date().getFullYear()} <a href='/' className='hover:underline'>version.rs</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
