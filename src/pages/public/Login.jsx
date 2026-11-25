import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../features/auth/authSlice';
import { ROLE_HOME_ROUTE } from '../../utils/constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(ROLE_HOME_ROUTE[result.payload.role] || '/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-sm p-7">
        <p className="font-display text-2xl text-center mb-1">Welcome back</p>
        <p className="text-[13px] text-gray-500 text-center mb-6">Log in to keep learning</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary-400"
            required
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary-400"
            required
          />
          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full py-2.5 mt-1">
            {loading ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="text-[13px] text-gray-500 text-center mt-5">
          No account? <Link to="/register" className="text-primary-700 font-medium">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;