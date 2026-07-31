import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const PasswordInput = ({ label, value, onChange, error, helperText, placeholder = 'Enter password' }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      {label ? <label className="text-sm font-medium text-slate-300">{label}</label> : null}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border px-3 py-2.5 pr-11 text-sm text-slate-100 outline-none transition focus:border-cyan-400 ${error ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-700 bg-slate-900'}`.trim()}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-100"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {helperText ? <p className={`text-xs ${error ? 'text-rose-300' : 'text-slate-500'}`}>{helperText}</p> : null}
    </div>
  )
}

export default PasswordInput
