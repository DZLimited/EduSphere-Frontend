import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Wraps routes that require the user to be logged in, regardless of role
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
