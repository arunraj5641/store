import { Loader2 } from 'lucide-react'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]'

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  }

  const variants = {
    primary: 'bg-[#00D9FF] text-[#030712] font-semibold hover:bg-[#38BDF8] shadow-[0_0_20px_rgba(0,217,255,0.25)] hover:shadow-[0_0_25px_rgba(0,217,255,0.4)] border border-[#00D9FF]/40',
    secondary: 'bg-[#111827] text-[#F8FAFC] border border-[#1F2937] hover:border-[#374151] hover:bg-[#1F2937]/60 shadow-sm',
    outline: 'border border-[#1F2937] bg-transparent text-[#F8FAFC] hover:border-[#00D9FF]/50 hover:text-[#00D9FF] hover:bg-[#00D9FF]/5',
    ghost: 'bg-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111827]',
    danger: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444]/25',
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-current" /> : null}
      {children}
    </button>
  )
}

export default Button

