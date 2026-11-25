import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCoupons, createCoupon, toggleCoupon, deleteCoupon } from '../../features/coupon/couponSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const Coupons = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.coupon);
  const [form, setForm] = useState({ code: '', discountPercent: '', expiresAt: '', maxUses: '' });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code,
      discountPercent: Number(form.discountPercent),
      expiresAt: form.expiresAt,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
    };
    const result = await dispatch(createCoupon(payload));
    if (createCoupon.fulfilled.match(result)) {
      toast.success('Coupon created');
      setForm({ code: '', discountPercent: '', expiresAt: '', maxUses: '' });
    } else {
      toast.error(result.payload || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon permanently?')) return;
    const result = await dispatch(deleteCoupon(id));
    if (deleteCoupon.fulfilled.match(result)) toast.success('Coupon deleted');
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Coupons</h1>

      <Card className="p-4 mb-6">
        <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input name="code" placeholder="CODE10" value={form.code} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-400" required />
          <input name="discountPercent" type="number" min="1" max="100" placeholder="% off" value={form.discountPercent} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-400" required />
          <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-400" required />
          <input name="maxUses" type="number" min="1" placeholder="Max uses" value={form.maxUses} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-400" />
          <Button type="submit">+ Create</Button>
        </form>
      </Card>

      {loading ? (
        <Loader />
      ) : (
        <Card className="divide-y divide-gray-100">
          {items.length === 0 && <p className="p-4 text-[13px] text-gray-500">No coupons yet.</p>}
          {items.map((c) => (
            <div key={c._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[13px] font-medium">{c.code} — {c.discountPercent}% off</p>
                <p className="text-xs text-gray-500">
                  Expires {new Date(c.expiresAt).toLocaleDateString()} · Used {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''} times
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={c.isActive ? 'success' : 'gray'}>{c.isActive ? 'active' : 'inactive'}</Badge>
                <button onClick={() => dispatch(toggleCoupon(c._id))} className="text-[13px] text-gray-600 hover:underline">
                  {c.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(c._id)} className="text-[13px] text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default Coupons;