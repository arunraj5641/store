import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'

const PasswordInput = ({
  label = 'Password',
  value,
  onChange,
  error,
  helperText,
  placeholder = 'Enter password',
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 text-[#94A3B8]">
          <Lock className="h-4 w-4" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-[#111827] pl-10 pr-11 py-2.5 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition-all duration-200 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 ${
            error
              ? 'border-[#EF4444]/60 bg-[#EF4444]/10 text-[#F8FAFC] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#1F2937] hover:border-[#374151]'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 text-[#94A3B8] transition hover:text-[#F8FAFC] focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {helperText ? (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-[#94A3B8]'}`}>{helperText}</p>
      ) : null}
    </div>
  )
}

export default PasswordInput

