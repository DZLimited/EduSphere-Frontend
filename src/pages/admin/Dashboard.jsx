import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingCourses } from '../../features/admin/adminSlice';
import Card from '../../components/common/Card';
import MetricTile from '../../components/common/MetricTile';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { pendingCourses } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchPendingCourses());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl mb-8">Admin overview</h1>

      <div className="grid grid-cols-3 gap-3 mb-8 max-w-lg">
        <MetricTile label="Pending review" value={pendingCourses.length} color="accent" />
      </div>

      {pendingCourses.length > 0 && (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">Courses waiting on you</p>
          {pendingCourses.slice(0, 5).map((c) => (
            <div key={c._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <p className="text-sm">{c.title}</p>
              <Link to="/admin/courses" className="text-xs text-primary-700">Review →</Link>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default Dashboard;