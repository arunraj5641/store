import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import ProtectedRoutes from './ProtectedRoutes'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoutes />} />
        <Route path="/login" element={<PublicRoutes />} />
        <Route path="/signup" element={<PublicRoutes />} />
        <Route path="/forgot-password" element={<PublicRoutes />} />
        <Route path="/*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

