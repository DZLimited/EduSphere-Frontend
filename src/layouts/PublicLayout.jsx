import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/common/Logo';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      <header className="border-b border-gray-200 px-6 py-3.5 flex items-center justify-between bg-white">
        <Link to="/">
          <Logo size={26} wordmarkClassName="text-lg" />
        </Link>
        <nav className="flex items-center gap-5 text-[13px] text-gray-600">
          <Link to="/courses" className="hover:text-gray-900">Courses</Link>
          <Link to="/login" className="hover:text-gray-900">Log in</Link>
          <Link to="/register" className="bg-primary-700 text-white px-3.5 py-1.5 rounded-lg hover:bg-primary-800 font-medium">
            Sign up
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 px-6 py-6 text-[13px] text-gray-400 bg-white">
        © 2026 EduSphere
      </footer>
    </div>
  );
};

export default PublicLayout;