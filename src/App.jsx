import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from './components/common/AuthInitializer';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import ParentLayout from './layouts/ParentLayout';
import AdminLayout from './layouts/AdminLayout';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public pages
import Home from './pages/public/Home';
import CourseListing from './pages/public/CourseListing';
import CourseDetails from './pages/public/CourseDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Unauthorized from './pages/public/Unauthorized';
import NotFound from './pages/public/NotFound';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import MyLearning from './pages/student/MyLearning';
import CoursePlayer from './pages/student/CoursePlayer';
import Wishlist from './pages/student/Wishlist';
import Cart from './pages/student/Cart';
import Checkout from './pages/student/Checkout';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import MyCourses from './pages/teacher/MyCourses';
import CreateCourse from './pages/teacher/CreateCourse';
import Earnings from './pages/teacher/Earnings';
import QnA from './pages/teacher/QnA';
import CourseCurriculum from './pages/teacher/CourseCurriculum';

// Parent pages
import ParentDashboard from './pages/parent/Dashboard';
import ChildProgress from './pages/parent/ChildProgress';
import LinkChild from './pages/parent/LinkChild';
import ParentRequests from './pages/student/ParentRequests';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCourses from './pages/admin/ManageCourses';
import Coupons from './pages/admin/Coupons';
import Payouts from './pages/admin/Payouts';
import Settings from './pages/admin/Settings';
import Categories from './pages/admin/Categories';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AuthInitializer>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CourseListing />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Student routes — protected + role-locked */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={['student']} />}>
              <Route element={<StudentLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/my-learning" element={<MyLearning />} />
                <Route path="/student/course-player/:courseId" element={<CoursePlayer />} />
                <Route path="/student/wishlist" element={<Wishlist />} />
                <Route path="/student/cart" element={<Cart />} />
                <Route path="/student/checkout" element={<Checkout />} />
                <Route path="/student/parent-requests" element={<ParentRequests />} />
              </Route>
            </Route>

            {/* Teacher routes */}
            <Route element={<RoleRoute allowedRoles={['teacher']} />}>
              <Route element={<TeacherLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/my-courses" element={<MyCourses />} />
                <Route path="/teacher/create-course" element={<CreateCourse />} />
                <Route path="/teacher/earnings" element={<Earnings />} />
                <Route path="/teacher/qna" element={<QnA />} />
                <Route path="/teacher/course/:courseId/curriculum" element={<CourseCurriculum />} />
              </Route>
            </Route>

            {/* Parent routes */}
            <Route element={<RoleRoute allowedRoles={['parent']} />}>
              <Route element={<ParentLayout />}>
                <Route path="/parent/dashboard" element={<ParentDashboard />} />
                <Route path="/parent/child-progress/:childId" element={<ChildProgress />} />
                <Route path="/parent/link-child" element={<LinkChild />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/courses" element={<ManageCourses />} />
                <Route path="/admin/coupons" element={<Coupons />} />
                <Route path="/admin/payouts" element={<Payouts />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/categories" element={<Categories />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthInitializer>
    </BrowserRouter>
  );
}

export default App;