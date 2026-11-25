import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyLinkRequests, respondToLinkRequest } from '../../features/parent/parentSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const ParentRequests = () => {
  const dispatch = useDispatch();
  const { linkRequests, loading } = useSelector((state) => state.parent);

  useEffect(() => {
    dispatch(fetchMyLinkRequests());
  }, [dispatch]);

  const handleRespond = async (id, action) => {
    const result = await dispatch(respondToLinkRequest({ id, action }));
    if (respondToLinkRequest.fulfilled.match(result)) {
      toast.success(action === 'approve' ? 'Approved' : 'Rejected');
    } else {
      toast.error(result.payload || 'Failed to respond');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Parent Link Requests</h1>

      {linkRequests.length === 0 ? (
        <p className="text-sm text-gray-500">No pending requests.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {linkRequests.map((req) => (
            <div key={req._id} className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{req.parent.name}</p>
                <p className="text-xs text-gray-500">{req.parent.email}</p>
                <p className="text-xs text-gray-400 mt-1">wants to view your course progress</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleRespond(req._id, 'approve')}>Approve</Button>
                <Button variant="secondary" onClick={() => handleRespond(req._id, 'reject')}>Reject</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentRequests;