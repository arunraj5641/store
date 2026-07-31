import { Inbox } from 'lucide-react'

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1F2937] bg-[#111827]/40 p-10 text-center animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1F2937] bg-[#030712] text-[#00D9FF] shadow-inner mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#94A3B8]">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export default EmptyState

