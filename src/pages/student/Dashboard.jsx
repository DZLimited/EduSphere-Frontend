import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyEnrollments } from '../../features/enrollment/enrollmentSlice';
import Card from '../../components/common/Card';
import MetricTile from '../../components/common/MetricTile';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.enrollment);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const validItems = items.filter((e) => e.course);
  const inProgress = validItems.filter((e) => e.progressPercent > 0 && e.progressPercent < 100);
  const completed = validItems.filter((e) => e.isCompleted);

  return (
    <div>
      <h1 className="text-2xl mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-gray-500 mb-8">Here's where you left off.</p>

      <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg">
        <MetricTile label="Enrolled" value={validItems.length} />
        <MetricTile label="In progress" value={inProgress.length} color="primary" />
        <MetricTile label="Completed" value={completed.length} color="success" />
      </div>

      {inProgress.length > 0 && (
        <>
          <h2 className="font-medium mb-3">Continue learning</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {inProgress.slice(0, 3).map((e) => (
              <Link key={e._id} to={`/student/course-player/${e.course._id}`}>
                <Card hover className="overflow-hidden">
                  <img src={e.course.thumbnail} className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <p className="text-sm font-medium line-clamp-1 mb-2">{e.course.title}</p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-success-600 h-1.5 rounded-full" style={{ width: `${e.progressPercent}%` }} />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;