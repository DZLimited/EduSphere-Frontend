import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../../features/auth/authSlice';
import Loader from './Loader';

// Runs once on app load — if a token exists but we don't have the user yet
// (e.g. after a hard refresh), fetch it before rendering any protected routes.
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const shouldRehydrate = token && !user;

  useEffect(() => {
    if (shouldRehydrate) {
      dispatch(fetchCurrentUser());
    }
  }, [shouldRehydrate, dispatch]);

  if (shouldRehydrate) {
    return <Loader />;
  }

  return children;
};

export default AuthInitializer;