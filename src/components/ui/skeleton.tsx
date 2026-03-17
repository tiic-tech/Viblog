import { cn } from '@/lib/utils'

function Skeleton({
  className,
  variant = 'pulse',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'pulse' | 'shimmer'
}) {
  if (variant === 'shimmer') {
    return (
      <div
        className={cn('relative overflow-hidden rounded-md bg-bg-elevated', className)}
        {...props}
      >
        <div
          className="absolute inset-0 animate-shimmer"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    )
  }

  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />
}

export { Skeleton }
