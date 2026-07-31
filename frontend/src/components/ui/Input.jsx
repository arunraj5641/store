const Input = ({
  label,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`.trim()}>
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        {Icon ? (
          <div className="pointer-events-none absolute left-3 text-[#94A3B8]">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-[#111827] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 ${
            Icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-[#EF4444]/60 bg-[#EF4444]/10 text-[#F8FAFC] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#1F2937] hover:border-[#374151]'
          }`}
          {...props}
        />
      </div>
      {helperText ? (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default Input

