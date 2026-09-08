import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-90 active:opacity-80',
        secondary: 'border border-border bg-surface hover:bg-muted active:bg-accent',
        ghost: 'hover:bg-muted active:bg-accent',
        destructive: 'text-destructive hover:bg-muted'
      },
      size: { default: 'h-11', icon: 'size-11 p-0', lg: 'min-h-12 px-6 text-base' }
    },
    defaultVariants: { variant: 'primary', size: 'default' }
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
