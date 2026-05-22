import { cn } from '@/lib/utils'

const LogoSvg = () => (
  <img src='/favicon/favicon.svg' alt='logo' className='w-8 h-8' />
)

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoSvg />
      <span className='text-xl font-semibold'>version.rs</span>
    </div>
  )
}

export default Logo
