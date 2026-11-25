import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart } from '../../features/cart/cartSlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce((sum, c) => sum + (c.discountPrice ?? c.price), 0);

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center max-w-md">
        <h1 className="text-xl mb-2">Your cart is empty</h1>
        <Link to="/courses" className="text-primary-700 text-[13px] font-medium">Browse courses →</Link>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl mb-6">Cart ({items.length})</h1>

      <div className="flex flex-col gap-2.5 mb-6">
        {items.map((course) => (
          <Card key={course._id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={course.thumbnail} alt={course.title} className="w-20 h-12 object-cover rounded-lg" />
              <p className="text-[13px] font-medium">{course.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-medium">${course.discountPrice ?? course.price}</span>
              <button
                onClick={() => dispatch(removeFromCart(course._id))}
                className="text-xs text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 flex items-center justify-between">
        <p className="text-[14px] font-medium">Total: <span className="text-primary-700">${total.toFixed(2)}</span></p>
        <Button variant="accent" onClick={() => navigate('/student/checkout')}>Proceed to checkout</Button>
      </Card>
    </div>
  );
};

export default Cart;