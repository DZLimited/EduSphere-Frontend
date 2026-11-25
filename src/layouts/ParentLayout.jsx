import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { IconHome, IconLink } from '../components/common/icons';

const ParentLayout = () => {
  const items = [
    { to: '/parent/dashboard', label: 'Dashboard', icon: <IconHome /> },
    { to: '/parent/link-child', label: 'Link a child', icon: <IconLink /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar roleLabel="Parent" items={items} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ParentLayout;