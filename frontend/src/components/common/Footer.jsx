import { Store, ShieldCheck } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="border-t border-[#1F2937] bg-[#030712] px-6 py-8 text-xs text-[#94A3B8]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-[#00D9FF]" />
          <span className="font-semibold text-[#F8FAFC]">Kirana OS</span>
          <span className="text-[#1F2937]">|</span>
          <span>AI-Powered Store Management Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2.5 py-1 text-[11px] font-medium text-[#10B981]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Systems Operational
          </span>
          <span>© {new Date().getFullYear()} Kirana OS. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

