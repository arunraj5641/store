import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../contexts/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})

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

    const result = signup(form)
    if (result.success) navigate('/dashboard')
    else setErrors((current) => ({ ...current, form: result.message }))
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your store workspace with a polished onboarding experience."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">Sign in</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 ${errors.name ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-700 bg-slate-900'}`.trim()}
            placeholder="Amit Sharma"
          />
          {errors.name ? <p className="mt-2 text-xs text-rose-300">{errors.name}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 ${errors.email ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-700 bg-slate-900'}`.trim()}
            placeholder="you@example.com"
          />
          {errors.email ? <p className="mt-2 text-xs text-rose-300">{errors.email}</p> : null}
        </div>

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

        {errors.form ? <p className="text-sm text-rose-300">{errors.form}</p> : null}

        <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Create account</button>
      </form>
    </AuthCard>
  )
}

export default Signup
