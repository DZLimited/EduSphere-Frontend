import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCoursesApi } from '../../api/courseApi';
import { getCategoriesApi } from '../../api/categoryApi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const CourseListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    getCategoriesApi().then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory) params.category = activeCategory;
    if (searchParams.get('keyword')) params.keyword = searchParams.get('keyword');

    getCoursesApi(params)
      .then(({ data }) => setCourses(data.data))
      .finally(() => setLoading(false));
  }, [activeCategory, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (keyword) next.set('keyword', keyword); else next.delete('keyword');
    setSearchParams(next);
  };

  const handleCategoryClick = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === activeCategory) next.delete('category'); else next.set('category', id);
    setSearchParams(next);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl mb-6">All courses</h1>

      <form onSubmit={handleSearch} className="mb-5">
        <input
          type="text"
          placeholder="Search courses…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-[13px] w-full max-w-md focus:outline-none focus:border-primary-400"
        />
      </form>

      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => handleCategoryClick('')}
          className={`px-3.5 py-1.5 rounded-full text-[13px] border transition-colors ${
            !activeCategory ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleCategoryClick(cat._id)}
            className={`px-3.5 py-1.5 rounded-full text-[13px] border transition-colors ${
              activeCategory === cat._id ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <p className="text-[13px] text-gray-500">No courses match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link key={course._id} to={`/courses/${course._id}`}>
              <Card hover className="overflow-hidden h-full">
                <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover" />
                <div className="p-3.5">
                  <p className="font-medium text-[13px] line-clamp-2 mb-1">{course.title}</p>
                  <p className="text-[12px] text-gray-500 mb-2">{course.teacher?.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="gray">{course.level}</Badge>
                    {course.totalReviews > 0 && (
                      <span className="text-[12px] text-accent-700">★ {course.avgRating} ({course.totalReviews})</span>
                    )}
                  </div>
                  <p className="text-[13px] font-medium">
                    {course.discountPrice ? (
                      <>
                        <span className="text-primary-700">${course.discountPrice}</span>{' '}
                        <span className="text-gray-400 line-through text-[11px]">${course.price}</span>
                      </>
                    ) : course.price > 0 ? `$${course.price}` : 'Free'}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseListing;