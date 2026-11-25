import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyEnrollments } from '../../features/enrollment/enrollmentSlice';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const MyLearning = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.enrollment);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  if (loading) return <Loader />;

  const validItems = items.filter((e) => e.course);

  return (
    <div>
      <h1 className="text-2xl mb-6">My learning</h1>

      {validItems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[13px] text-gray-500 mb-3">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="text-primary-700 text-[13px] font-medium">Browse courses →</Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {validItems.map((enrollment) => (
            <Link key={enrollment._id} to={`/student/course-player/${enrollment.course._id}`}>
              <Card hover className="overflow-hidden h-full">
                <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-32 object-cover" />
                <div className="p-3.5">
                  <p className="font-medium text-[13px] line-clamp-2 mb-1">{enrollment.course.title}</p>
                  <p className="text-[12px] text-gray-500 mb-3">{enrollment.course.teacher?.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-success-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${enrollment.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[12px] text-success-700 font-medium mt-1.5">
                    {enrollment.isCompleted ? 'Completed' : `${enrollment.progressPercent}% complete`}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;