import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-200/70 via-gray-100/70 to-gray-200/70 dark:from-muted/50 dark:via-muted dark:to-muted/50 bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] animate-[shine_2s_infinite] dark:via-white/20" />
      </div>
    </div>
  )
}

export { Skeleton } 