import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface VerifiedBadgeProps {
  size?: "sm" | "md"
  className?: string
}

export function VerifiedBadge({ size = "md", className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-gold text-gold-foreground",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      <BadgeCheck className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      Verified
    </span>
  )
}
