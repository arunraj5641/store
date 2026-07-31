import { Search } from 'lucide-react'

const SearchBar = ({ placeholder = 'Search inventory, products, customers...', value, onChange }) => {
  return (
    <div className="relative flex items-center w-full max-w-md">
      <Search className="absolute left-3.5 h-4 w-4 text-[#94A3B8]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#1F2937] bg-[#111827]/80 pl-10 pr-12 py-2 text-sm text-[#F8FAFC] placeholder-[#475569] outline-none transition duration-200 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 hover:border-[#374151]"
      />
      <div className="absolute right-3 hidden items-center gap-0.5 rounded border border-[#1F2937] bg-[#030712] px-1.5 py-0.5 text-[10px] font-mono text-[#94A3B8] sm:flex">
        <span>⌘</span>K
      </div>
    </div>
  )
}

export default SearchBar

