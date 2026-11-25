import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { IconHome, IconTag, IconBook, IconUsers, IconPercent, IconWallet } from '../components/common/icons';

const AdminLayout = () => {
  const items = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <IconHome /> },
    { to: '/admin/categories', label: 'Categories', icon: <IconTag /> },
    { to: '/admin/courses', label: 'Courses', icon: <IconBook /> },
    { to: '/admin/users', label: 'Users', icon: <IconUsers /> },
    { to: '/admin/coupons', label: 'Coupons', icon: <IconPercent /> },
    { to: '/admin/payouts', label: 'Payouts', icon: <IconWallet /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar roleLabel="Admin" items={items} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;