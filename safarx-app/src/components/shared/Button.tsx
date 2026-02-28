import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      primary: "bg-white text-black hover:bg-gray-200 hover:scale-105 shadow-lg",
      secondary: "bg-gray-800 text-white hover:bg-gray-700 hover:scale-105",
      outline: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-black hover:scale-105",
      ghost: "bg-transparent text-white hover:bg-white/10"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-8 py-4 text-lg",
      lg: "px-12 py-6 text-xl"
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }