import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../layouts/DashboardLayout'
import Analytics from '../pages/Analytics'
import Assistant from '../pages/Assistant'
import Customers from '../pages/Customers'
import Dashboard from '../pages/Dashboard'
import Inventory from '../pages/Inventory'
import NotFound from '../pages/NotFound'
import Notifications from '../pages/Notifications'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import Sales from '../pages/Sales'
import Settings from '../pages/Settings'

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  )
}

export default ProtectedRoutes
