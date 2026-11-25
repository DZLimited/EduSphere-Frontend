import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (course) => {
    dispatch(addToCart({
      _id: course._id, title: course.title, thumbnail: course.thumbnail,
      price: course.price, discountPrice: course.discountPrice,
    }));
    toast.success('Added to cart');
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl mb-6">Wishlist</h1>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-[13px] text-gray-500 mb-3">Nothing saved yet.</p>
          <Link to="/courses" className="text-primary-700 text-[13px] font-medium">Browse courses →</Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((course) => (
            <Card key={course._id} className="overflow-hidden">
              <Link to={`/courses/${course._id}`}>
                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
              </Link>
              <div className="p-3.5">
                <Link to={`/courses/${course._id}`}>
                  <p className="font-medium text-[13px] line-clamp-2 mb-1">{course.title}</p>
                </Link>
                <p className="text-[12px] text-gray-500 mb-3">{course.teacher?.name}</p>
                <p className="text-[13px] font-medium mb-3">{course.price > 0 ? `$${course.discountPrice ?? course.price}` : 'Free'}</p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleAddToCart(course)}>Add to cart</Button>
                  <button onClick={() => handleRemove(course._id)} className="text-xs text-red-600 px-2">Remove</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;