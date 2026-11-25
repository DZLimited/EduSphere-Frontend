import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyCourses } from '../../features/course/courseSlice';
import MetricTile from '../../components/common/MetricTile';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const published = items.filter((c) => c.status === 'published');
  const totalStudents = published.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

  return (
    <div>
      <h1 className="text-2xl mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-gray-500 mb-8">Here's how your courses are doing.</p>

      <div className="grid grid-cols-4 gap-3 max-w-2xl">
        <MetricTile label="Courses" value={items.length} />
        <MetricTile label="Published" value={published.length} color="success" />
        <MetricTile label="Students" value={totalStudents} color="primary" />
        <MetricTile label="Balance" value={`$${(user?.earnings ?? 0).toFixed(0)}`} color="accent" />
      </div>
    </div>
  );
};

export default Dashboard;