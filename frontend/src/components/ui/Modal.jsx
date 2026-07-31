import { X } from 'lucide-react'
import { useEffect } from 'react'

const Modal = ({ title, children, isOpen = false, onClose, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-2xl shadow-black/80 animate-slide-up`}>

        <div className="flex items-center justify-between pb-4 border-b border-[#1F2937]">
          <h2 className="text-lg font-semibold text-[#F8FAFC]">{title}</h2>
          {onClose ? (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#94A3B8] transition hover:bg-[#1F2937] hover:text-[#F8FAFC]"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
        <div className="pt-4 text-sm text-[#94A3B8]">{children}</div>
      </div>
    </div>
  )
}

export default Modal

