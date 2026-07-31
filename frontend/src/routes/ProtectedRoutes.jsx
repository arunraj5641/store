import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Inventory from '../pages/Inventory'
import Products from '../pages/Products'
import Sales from '../pages/Sales'
import Customers from '../pages/Customers'
import Analytics from '../pages/Analytics'
import Notifications from '../pages/Notifications'
import Assistant from '../pages/Assistant'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import NotFound from '../pages/NotFound'

const ProtectedRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
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
