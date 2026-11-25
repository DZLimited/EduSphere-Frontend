import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchPendingCourses, approveCourse, rejectCourse } from '../../features/admin/adminSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';

const ManageCourses = () => {
  const dispatch = useDispatch();
  const { pendingCourses, loading } = useSelector((state) => state.admin);
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingCourses());
  }, [dispatch]);

  const handleApprove = async (id) => {
    const result = await dispatch(approveCourse(id));
    if (approveCourse.fulfilled.match(result)) toast.success('Course approved and published');
  };

  const handleReject = async (id) => {
    if (!reason.trim()) { toast.error('Please provide a rejection reason'); return; }
    const result = await dispatch(rejectCourse({ id, reason }));
    if (rejectCourse.fulfilled.match(result)) {
      toast.success('Course rejected');
      setRejectingId(null);
      setReason('');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl mb-6">Course moderation</h1>

      {pendingCourses.length === 0 ? (
        <Card className="p-8 text-center text-[13px] text-gray-500">No courses pending review.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingCourses.map((course) => (
            <Card key={course._id} className="p-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-[14px] font-medium">{course.title}</p>
                  <p className="text-[13px] text-gray-500">
                    By {course.teacher?.name} ({course.teacher?.email}) · {course.category?.name} · {course.level}
                  </p>
                  <p className="text-[13px] mt-2 text-gray-600 line-clamp-2">{course.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Price: ${course.price} · Submitted: {new Date(course.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <img src={course.thumbnail} alt="" className="w-24 h-16 object-cover rounded-lg flex-shrink-0" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="success" onClick={() => handleApprove(course._id)}>Approve</Button>
                <Button variant="outline" onClick={() => setRejectingId(rejectingId === course._id ? null : course._id)}>
                  Reject
                </Button>
              </div>

              {rejectingId === course._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    placeholder="Reason for rejection…"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] flex-1 focus:outline-none focus:border-primary-400"
                  />
                  <Button variant="danger" onClick={() => handleReject(course._id)}>Confirm reject</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;