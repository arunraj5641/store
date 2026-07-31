import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const DashboardLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar />
          <main className="flex-1 bg-[#030712] p-4 sm:p-6 lg:p-8 animate-fade-in">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout

