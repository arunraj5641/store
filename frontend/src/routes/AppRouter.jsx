import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRoutes from './PublicRoutes'
import ProtectedRoutes from './ProtectedRoutes'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/*" element={<ProtectedRoutes />} />
        <Route path="/inventory/*" element={<ProtectedRoutes />} />
        <Route path="/products/*" element={<ProtectedRoutes />} />
        <Route path="/sales/*" element={<ProtectedRoutes />} />
        <Route path="/customers/*" element={<ProtectedRoutes />} />
        <Route path="/analytics/*" element={<ProtectedRoutes />} />
        <Route path="/notifications/*" element={<ProtectedRoutes />} />
        <Route path="/assistant/*" element={<ProtectedRoutes />} />
        <Route path="/profile/*" element={<ProtectedRoutes />} />
        <Route path="/settings/*" element={<ProtectedRoutes />} />
        <Route path="/*" element={<PublicRoutes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
