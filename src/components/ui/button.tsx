import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "outline" | "destructive" | "secondary"
}

const buttonVariants = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700",
  outline:
    "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  destructive:
    "bg-red-600 text-white hover:bg-red-700",
  secondary:
    "bg-gray-200 text-gray-800 hover:bg-gray-300",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
          buttonVariants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }
