import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}>
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">{description}</p>
      {action && (
        <Button asChild variant="ocean">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}
