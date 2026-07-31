import Sidebar from '../components/common/Sidebar'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Navbar />
          <main className="flex-1 bg-slate-950 px-6 py-8">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
