import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import PasswordInput from '../components/auth/PasswordInput'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})

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

    const result = login(form)
    if (result.success) navigate('/dashboard')
    else setErrors((current) => ({ ...current, form: result.message }))
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your store workspace and continue with your operations."
      footer={
        <p>
          New here?{' '}
          <Link to="/signup" className="font-semibold text-cyan-300 transition hover:text-cyan-200">Create an account</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <input type="checkbox" checked={form.remember} onChange={() => setForm((current) => ({ ...current, remember: !current.remember }))} className="h-4 w-4 rounded border-slate-700 bg-slate-900 accent-cyan-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">Forgot password?</Link>
        </div>

        {errors.form ? <p className="text-sm text-rose-300">{errors.form}</p> : null}

        <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Login</button>
      </form>
    </AuthCard>
  )
}

export default Login
