import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'
import NotFound from '../pages/NotFound'

const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PublicLayout>
  )
}

export default PublicRoutes
