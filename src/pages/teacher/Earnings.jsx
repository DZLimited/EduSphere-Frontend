import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchMyPayouts, requestPayout } from '../../features/payout/payoutSlice';
import { fetchCurrentUser } from '../../features/auth/authSlice';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const statusVariant = { requested: 'accent', processing: 'primary', paid: 'success', rejected: 'danger' };

const Earnings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myPayouts } = useSelector((state) => state.payout);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    dispatch(fetchMyPayouts());
  }, [dispatch]);

  const handleRequest = async (e) => {
    e.preventDefault();
    const result = await dispatch(requestPayout(Number(amount)));
    if (requestPayout.fulfilled.match(result)) {
      toast.success('Payout requested');
      setAmount('');
      dispatch(fetchCurrentUser());
    } else {
      toast.error(result.payload || 'Failed to request payout');
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl mb-2">Earnings</h1>
      <p className="text-3xl font-medium text-primary-700 mb-1">${(user?.earnings ?? 0).toFixed(2)}</p>
      <p className="text-xs text-gray-400 mb-6">Available balance</p>

      <form onSubmit={handleRequest} className="flex gap-2 mb-8">
        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="Amount to withdraw"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] flex-1 focus:outline-none focus:border-primary-400"
          required
        />
        <Button type="submit">Request payout</Button>
      </form>

      <h2 className="font-medium text-[14px] mb-3">Payout history</h2>
      <div className="flex flex-col gap-2">
        {myPayouts.length === 0 && <p className="text-[13px] text-gray-500">No payout requests yet.</p>}
        {myPayouts.map((p) => (
          <div key={p._id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="text-[13px] font-medium">${p.amount.toFixed(2)}</p>
              <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <Badge variant={statusVariant[p.status]}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earnings;