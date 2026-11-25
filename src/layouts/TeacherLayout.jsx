import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import NotificationBell from "../components/common/NotificationBell";
import {
  IconHome,
  IconBook,
  IconPlus,
  IconWallet,
  IconMessage,
} from "../components/common/icons";

const TeacherLayout = () => {
  const items = [
    { to: "/teacher/dashboard", label: "Dashboard", icon: <IconHome /> },
    { to: "/teacher/my-courses", label: "My courses", icon: <IconBook /> },
    {
      to: "/teacher/create-course",
      label: "Create course",
      icon: <IconPlus />,
    },
    { to: "/teacher/earnings", label: "Earnings", icon: <IconWallet /> },
    { to: "/teacher/qna", label: "Q&A", icon: <IconMessage /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAFAF9]">
      <Sidebar roleLabel="Teacher" items={items} extra={<NotificationBell />} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
