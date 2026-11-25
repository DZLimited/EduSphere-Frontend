import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { IconHome, IconGraduation, IconHeart, IconCart, IconLink } from '../components/common/icons';

const StudentLayout = () => {
  const items = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <IconHome /> },
    { to: '/student/my-learning', label: 'My learning', icon: <IconGraduation /> },
    { to: '/student/wishlist', label: 'Wishlist', icon: <IconHeart /> },
    { to: '/student/cart', label: 'Cart', icon: <IconCart /> },
    { to: '/student/parent-requests', label: 'Parent requests', icon: <IconLink /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar roleLabel="Student" items={items} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;