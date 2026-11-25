import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkout } from '../../features/enrollment/enrollmentSlice';
import { clearCart } from '../../features/cart/cartSlice';
import { validateCoupon, clearAppliedCoupon } from '../../features/coupon/couponSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const Checkout = () => {
  const items = useSelector((state) => state.cart.items);
  const { checkoutLoading } = useSelector((state) => state.enrollment);
  const { appliedCoupon } = useSelector((state) => state.coupon);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((sum, c) => sum + (c.discountPrice ?? c.price), 0);
  const total = appliedCoupon ? subtotal * (1 - appliedCoupon.discountPercent / 100) : subtotal;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const courseIds = items.map((c) => c._id);
    const result = await dispatch(validateCoupon({ code: couponCode, courseIds }));
    if (validateCoupon.fulfilled.match(result)) {
      toast.success(`Coupon applied: ${result.payload.discountPercent}% off`);
    } else {
      toast.error(result.payload || 'Invalid coupon');
    }
  };

  const handlePay = async () => {
    const courseIds = items.map((c) => c._id);
    const result = await dispatch(checkout({ courseIds, couponCode: appliedCoupon?.code }));

    if (checkout.fulfilled.match(result)) {
      dispatch(clearCart());
      dispatch(clearAppliedCoupon());
      toast.success('Payment successful — you are enrolled!');
      navigate('/student/my-learning');
    } else {
      toast.error(result.payload || 'Payment failed');
    }
  };

  if (items.length === 0) {
    return <p className="text-[13px] text-gray-500">Your cart is empty. Nothing to check out.</p>;
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl mb-6">Checkout</h1>

      <Card className="p-4 mb-4">
        {items.map((c) => (
          <div key={c._id} className="flex justify-between text-[13px] py-1">
            <span>{c.title}</span>
            <span>${c.discountPrice ?? c.price}</span>
          </div>
        ))}
        {appliedCoupon && (
          <div className="flex justify-between text-[13px] py-1 text-success-700">
            <span>Coupon ({appliedCoupon.code})</span>
            <span>-{appliedCoupon.discountPercent}%</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-[14px] border-t border-gray-100 mt-2 pt-2">
          <span>Total</span>
          <span className="text-primary-700">${total.toFixed(2)}</span>
        </div>
      </Card>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] flex-1 focus:outline-none focus:border-primary-400"
        />
        <Button variant="outline" onClick={handleApplyCoupon}>Apply</Button>
      </div>

      <div className="mb-4">
        <Badge variant="accent">Test mode — no real payment gateway connected yet</Badge>
      </div>

      <Button variant="accent" className="w-full py-3 text-[14px]" onClick={handlePay} disabled={checkoutLoading}>
        {checkoutLoading ? 'Processing…' : `Pay $${total.toFixed(2)}`}
      </Button>
    </div>
  );
};

export default Checkout;