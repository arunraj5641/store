import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, AlertCircle, ArrowRight } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setTimeout(() => {
      const result = login(form)
      setIsLoading(false)
      if (result.success) navigate('/dashboard')
      else setErrors((current) => ({ ...current, form: result.message }))
    }, 300)
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your store workspace and continue with your operations."
      footer={
        <p className="text-xs text-[#94A3B8]">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-[#00D9FF] transition hover:text-[#38BDF8]">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          error={Boolean(errors.email)}
          helperText={errors.email}
          placeholder="you@example.com"
        />

        <PasswordInput
          label="Password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          error={Boolean(errors.password)}
          helperText={errors.password}
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2.5 text-xs text-[#94A3B8] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={() => setForm((current) => ({ ...current, remember: !current.remember }))}
              className="h-4 w-4 rounded border-[#1F2937] bg-[#111827] text-[#00D9FF] accent-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF]"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-[#00D9FF] transition hover:text-[#38BDF8]"
          >
            Forgot password?
          </Link>
        </div>

        {errors.form ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 p-3 text-xs text-[#EF4444]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Sign In <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </AuthCard>
  )
}

export default Login

