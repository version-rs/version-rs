import * as React from 'react'
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function NavigationMenu({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root data-slot='navigation-menu' className={cn('relative flex max-w-max flex-1 items-center justify-center', className)} {...props}>
      {children}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot='navigation-menu-list' className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)} {...props} />
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot='navigation-menu-item' className={cn('relative', className)} {...props} />
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return <NavigationMenuPrimitive.Link data-slot='navigation-menu-link' className={cn("hover:bg-accent hover:text-accent-foreground flex p-2 text-sm transition-all", className)} {...props} />
}

export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink }
