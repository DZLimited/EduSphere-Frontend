import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAllPayouts, approvePayout, rejectPayout } from '../../features/payout/payoutSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const statusStyles = {
  requested: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const Payouts = () => {
  const dispatch = useDispatch();
  const { allPayouts, loading } = useSelector((state) => state.payout);

  useEffect(() => {
    dispatch(fetchAllPayouts());
  }, [dispatch]);

  const handleApprove = async (id) => {
    const result = await dispatch(approvePayout(id));
    if (approvePayout.fulfilled.match(result)) toast.success('Payout marked as paid');
  };

  const handleReject = async (id) => {
    const result = await dispatch(rejectPayout(id));
    if (rejectPayout.fulfilled.match(result)) toast.success('Payout rejected, funds returned to teacher');
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-medium mb-6">Payout Requests</h1>

      <div className="flex flex-col gap-3">
        {allPayouts.length === 0 && <p className="text-sm text-gray-500">No payout requests yet.</p>}
        {allPayouts.map((p) => (
          <div key={p._id} className="border border-gray-200 rounded-lg p-4 bg-white flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{p.teacher?.name} — ${p.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{p.teacher?.email}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${statusStyles[p.status]}`}>{p.status}</span>
            </div>
            {(p.status === 'requested' || p.status === 'processing') && (
              <div className="flex gap-2">
                <Button onClick={() => handleApprove(p._id)}>Mark paid</Button>
                <Button variant="secondary" onClick={() => handleReject(p._id)}>Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payouts;