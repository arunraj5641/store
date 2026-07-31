import { AlertTriangle } from 'lucide-react'

const ErrorState = ({
  title = 'Something went wrong',
  description = 'Please try refreshing or check back later.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 p-8 text-center animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EF4444]/20 text-[#EF4444] mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[#94A3B8]">{description}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-[#EF4444] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#EF4444]/90"
        >
          Try Again
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState

