import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) {
      setError('Email is required.')
      setSuccess('')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email.')
      setSuccess('')
      return
    }

    setError('')
    setSuccess('Password reset instructions were prepared for this demo flow.')
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will guide you through the next steps."
      footer={
        <p>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-cyan-300 transition hover:text-cyan-200">Back to login</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 ${error ? 'border-rose-500/50 bg-rose-500/10' : 'border-slate-700 bg-slate-900'}`.trim()}
            placeholder="you@example.com"
          />
          {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
        </div>

        {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

        <button type="submit" className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">Reset password</button>
      </form>
    </AuthCard>
  )
}

export default ForgotPassword
