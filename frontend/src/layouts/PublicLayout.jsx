import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const PublicLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#00D9FF]/20 selection:text-[#00D9FF]">
      {/* Background Radial Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial-glow opacity-80" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-30" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default PublicLayout

