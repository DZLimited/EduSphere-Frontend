import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../features/auth/authSlice';
import { ROLE_HOME_ROUTE } from '../../utils/constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const roleOptions = [
  { value: 'student', label: 'Student — I want to learn' },
  { value: 'teacher', label: 'Instructor — I want to teach' },
  { value: 'parent', label: "Parent — I want to follow my child's progress" },
];

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      navigate(ROLE_HOME_ROUTE[result.payload.role] || '/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm p-7">
        <p className="font-display text-2xl text-center mb-1">Create your account</p>
        <p className="text-[13px] text-gray-500 text-center mb-6">Join EduSphere in seconds</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input name="name" placeholder="Full name" value={form.name} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary-400" required />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary-400" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-primary-400" required />

          <div className="flex flex-col gap-2 mt-1">
            {roleOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 text-[13px] cursor-pointer transition-colors ${
                  form.role === opt.value ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-gray-200 text-gray-600'
                }`}
              >
                <input
                  type="radio" name="role" value={opt.value}
                  checked={form.role === opt.value}
                  onChange={handleChange}
                  className="accent-primary-700"
                />
                {opt.label}
              </label>
            ))}
          </div>

          {error && <p className="text-[13px] text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full py-2.5 mt-1">
            {loading ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>

        <p className="text-[13px] text-gray-500 text-center mt-5">
          Already have an account? <Link to="/login" className="text-primary-700 font-medium">Log in</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;