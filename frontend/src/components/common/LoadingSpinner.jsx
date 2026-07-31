import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ label = 'Loading workspace...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-10 w-10 animate-ping rounded-full bg-[#00D9FF]/20" />
        <Loader2 className="h-8 w-8 animate-spin text-[#00D9FF]" />
      </div>
      {label ? <p className="text-xs font-medium text-[#94A3B8]">{label}</p> : null}
    </div>
  )
}

export default LoadingSpinner

