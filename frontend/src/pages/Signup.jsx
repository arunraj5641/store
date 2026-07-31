import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Full name is required.'
    if (!form.email.trim()) nextErrors.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email.'
    if (!form.password) nextErrors.password = 'Password is required.'
    else if (form.password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (!form.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password.'
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = 'Passwords do not match.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setTimeout(() => {
      const result = signup(form)
      setIsLoading(false)
      if (result.success) navigate('/dashboard')
      else setErrors((current) => ({ ...current, form: result.message }))
    }, 300)
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your store workspace with a polished onboarding experience."
      footer={
        <p className="text-xs text-[#94A3B8]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#00D9FF] transition hover:text-[#38BDF8]">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          icon={User}
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          error={Boolean(errors.name)}
          helperText={errors.name}
          placeholder="Amit Sharma"
        />

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
          placeholder="Create a password"
        />

        <PasswordInput
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          placeholder="Re-enter password"
        />

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
          Create account <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </AuthCard>
  )
}

export default Signup

