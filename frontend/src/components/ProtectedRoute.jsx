import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Basic check to see if token is expired on the frontend
  try {
    const payloadBase64 = token.split('.')[1];
    if (payloadBase64) {
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      const exp = decoded.exp;
      if (exp && Date.now() >= exp * 1000) {
        localStorage.removeItem('adminToken');
        return <Navigate to="/admin/login" replace />;
      }
    }
  } catch (err) {
    // If token is malformed, clear it and redirect
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
  }
  
  return <Outlet />;
}
