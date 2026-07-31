import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setError('')
      setSuccess('Password reset instructions were prepared for this demo flow.')
    }, 300)
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we will guide you through the next steps."
      footer={
        <p className="text-xs text-[#94A3B8]">
          Remembered it?{' '}
          <Link to="/login" className="inline-flex items-center gap-1 font-semibold text-[#00D9FF] transition hover:text-[#38BDF8]">
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          placeholder="you@example.com"
        />

        {success ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#10B981]/40 bg-[#10B981]/10 p-3.5 text-xs text-[#10B981]">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full mt-2"
        >
          Reset password <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>
    </AuthCard>
  )
}

export default ForgotPassword

