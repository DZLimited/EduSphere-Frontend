import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChildProgress } from '../../features/parent/parentSlice';
import Loader from '../../components/common/Loader';

const ChildProgress = () => {
  const { childId } = useParams();
  const dispatch = useDispatch();
  const { childProgress, loading } = useSelector((state) => state.parent);

  useEffect(() => {
    dispatch(fetchChildProgress(childId));
  }, [dispatch, childId]);

  if (loading) return <Loader />;

  return (
    <div>
      <Link to="/parent/dashboard" className="text-sm text-primary-600 mb-4 inline-block">← Back</Link>
      <h1 className="text-2xl font-medium mb-6">Course Progress</h1>

       {childProgress.filter((e) => e.course).length === 0 ? (
        <p className="text-sm text-gray-500">This student hasn't enrolled in any courses yet.</p>
      ) : (
       <div className="flex flex-col gap-3">
          {childProgress.filter((e) => e.course).map((enrollment) => (
            <div key={enrollment._id} className="border border-gray-200 rounded-lg p-4 bg-white flex items-center gap-4">
              <img src={enrollment.course.thumbnail} alt="" className="w-24 h-14 object-cover rounded" />
              <div className="flex-1">
                <p className="font-medium text-sm">{enrollment.course.title}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${enrollment.progressPercent}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{enrollment.progressPercent}% complete</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChildProgress;