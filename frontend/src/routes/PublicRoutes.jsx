import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthenticationLayout from '../layouts/AuthenticationLayout'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
      <Route path="/login" element={<AuthenticationLayout><Login /></AuthenticationLayout>} />
      <Route path="/signup" element={<AuthenticationLayout><Signup /></AuthenticationLayout>} />
      <Route path="/forgot-password" element={<AuthenticationLayout><ForgotPassword /></AuthenticationLayout>} />
    </Routes>
  )
}

export default PublicRoutes


