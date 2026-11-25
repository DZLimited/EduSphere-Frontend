import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyChildren } from '../../features/parent/parentSlice';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { children, loading } = useSelector((state) => state.parent);

  useEffect(() => {
    dispatch(fetchMyChildren());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Your Children</h1>
        <Link to="/parent/link-child" className="text-sm text-primary-600">+ Link another child</Link>
      </div>

      {children.length === 0 ? (
        <p className="text-sm text-gray-500">
          No linked children yet. <Link to="/parent/link-child" className="text-primary-600">Send a request</Link> to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children.map((link) => (
            <Link
              key={link._id}
              to={`/parent/child-progress/${link.child._id}`}
              className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              <p className="font-medium">{link.child.name}</p>
              <p className="text-sm text-gray-500">{link.child.email}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;