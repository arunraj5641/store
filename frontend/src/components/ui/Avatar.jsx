const Avatar = ({ name = 'User', initials, size = 'md', className = '' }) => {
  const calculatedInitials = initials || (name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U')

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-[#00D9FF]/30 bg-gradient-to-br from-[#00D9FF]/20 to-[#38BDF8]/10 font-semibold text-[#00D9FF] shadow-sm ${sizes[size]} ${className}`.trim()}
    >
      {calculatedInitials}
    </div>
  )
}

export default Avatar

