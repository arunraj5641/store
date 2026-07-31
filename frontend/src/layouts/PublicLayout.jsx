import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
      <Footer />
    </div>
  )
}

export default PublicLayout
