import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getCourseByIdApi } from '../../api/courseApi';
import { addToCart } from '../../features/cart/cartSlice';
import { checkIfEnrolled } from '../../features/enrollment/enrollmentSlice';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { fetchCourseReviews, submitReview, clearReviews } from '../../features/review/reviewSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../features/wishlist/wishlistSlice';

const CourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const reviews = useSelector((state) => state.review.items);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const cartItems = useSelector((state) => state.cart.items);
  const isEnrolled = useSelector((state) => state.enrollment.isEnrolledInCurrent);
  const inCart = cartItems.some((c) => c._id === id);

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((c) => c._id === id);

  useEffect(() => {
    getCourseByIdApi(id)
      .then(({ data }) => setCourse(data.data))
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));

    if (isAuthenticated && role === 'student') {
      dispatch(checkIfEnrolled(id));
      dispatch(fetchWishlist());
    }

    dispatch(fetchCourseReviews(id));
    return () => dispatch(clearReviews());
  }, [id, dispatch, isAuthenticated, role]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: course._id,
      title: course.title,
      thumbnail: course.thumbnail,
      price: course.price,
      discountPrice: course.discountPrice,
    }));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(course));
      toast.success('Added to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const result = await dispatch(submitReview({ course: id, rating: newRating, comment: newComment }));
    if (submitReview.fulfilled.match(result)) {
      toast.success('Review submitted');
      setNewComment('');
    } else {
      toast.error(result.payload || 'Failed to submit review');
    }
  };

  const handleBuyNow = () => {
    if (!inCart) handleAddToCart();
    navigate('/student/cart');
  };

  if (loading) return <Loader />;
  if (!course) return <p className="p-6 text-[13px] text-gray-500">Course not found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <Badge variant="primary" className="mb-3">{course.level}</Badge>
          <h1 className="text-3xl mb-3">{course.title}</h1>
          <p className="text-gray-500 text-[15px] mb-4">{course.description}</p>
          <p className="text-[13px] text-gray-500">
            By <span className="text-primary-700 font-medium">{course.teacher?.name}</span> · {course.language}
            {course.totalReviews > 0 && <> · <span className="text-accent-700">★ {course.avgRating} ({course.totalReviews} reviews)</span></>}
          </p>

          {course.whatYouWillLearn?.length > 0 && (
            <Card className="p-5 mt-8">
              <h2 className="font-medium text-[14px] mb-3">What you'll learn</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {course.whatYouWillLearn.map((item, i) => (
                  <li key={i} className="text-[13px] text-gray-600 flex gap-2">
                    <span className="text-success-600 mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {course.requirements?.length > 0 && (
            <div className="mt-7">
              <h2 className="font-medium text-[14px] mb-2">Requirements</h2>
              <ul className="list-disc list-inside text-[13px] text-gray-600 space-y-1">
                {course.requirements.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-9">
            <h2 className="text-xl mb-4">
              Reviews {course.totalReviews > 0 && <span className="text-gray-400 text-[15px]">({course.avgRating} ★ · {course.totalReviews})</span>}
            </h2>

            {isEnrolled && (
              <Card className="p-4 mb-5">
                <form onSubmit={handleSubmitReview}>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-[13px] font-medium">Your rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-[13px] focus:outline-none focus:border-primary-400"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                    </select>
                  </div>
                  <textarea
                    placeholder="Share your thoughts about this course…"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={2}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] w-full mb-3 focus:outline-none focus:border-primary-400"
                  />
                  <Button type="submit">Submit review</Button>
                </form>
              </Card>
            )}

            <div className="flex flex-col gap-4">
              {reviews.length === 0 && <p className="text-[13px] text-gray-500">No reviews yet.</p>}
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium">{r.student?.name}</p>
                    <span className="text-xs text-accent-600">{'★'.repeat(r.rating)}</span>
                  </div>
                  {r.comment && <p className="text-[13px] text-gray-600 mt-1">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="p-4 h-fit sticky top-6">
          <img src={course.thumbnail} alt={course.title} className="w-full rounded-lg mb-4" />
          <p className="text-2xl font-medium mb-4">
            {course.discountPrice ? (
              <>
                <span>${course.discountPrice}</span>{' '}
                <span className="text-gray-400 line-through text-base">${course.price}</span>
              </>
            ) : course.price > 0 ? `$${course.price}` : 'Free'}
          </p>

          {!isAuthenticated ? (
            <Button className="w-full" onClick={() => navigate('/login')}>Log in to enroll</Button>
          ) : role !== 'student' ? (
            <p className="text-xs text-gray-500">Only student accounts can enroll in courses.</p>
          ) : isEnrolled ? (
            <Link to={`/student/course-player/${course._id}`}>
              <Button className="w-full">Go to course</Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="accent" className="w-full" onClick={handleBuyNow}>Buy now</Button>
              <Button variant="outline" className="w-full" onClick={handleAddToCart} disabled={inCart}>
                {inCart ? 'In cart' : 'Add to cart'}
              </Button>
              <button onClick={handleToggleWishlist} className="text-[13px] text-gray-500 hover:text-primary-700 mt-1">
                {isWishlisted ? '♥ Saved to wishlist' : '♡ Save to wishlist'}
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;