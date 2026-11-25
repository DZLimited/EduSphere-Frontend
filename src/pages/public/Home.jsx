import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCoursesApi } from '../../api/courseApi';
import { getCategoriesApi } from '../../api/categoryApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCoursesApi({ limit: 4 }).then(({ data }) => setCourses(data.data));
    getCategoriesApi().then(({ data }) => setCategories(data.data.slice(0, 6)));
  }, []);

  const heroCourse = courses[0];

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-14 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[13px] font-medium text-primary-700 mb-3">A course platform families can grow with</p>
          <h1 className="text-4xl md:text-5xl leading-tight mb-5">
            Learn something new.<br />Watch it stick.
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-md">
            EduSphere is a course marketplace where progress is visible to you, and if you're a
            student under 18, to the parent who's rooting for you.
          </p>
          <div className="flex gap-3">
            <Link to="/courses"><Button className="px-5 py-2.5 text-[14px]">Browse courses</Button></Link>
            <Link to="/register"><Button variant="outline" className="px-5 py-2.5 text-[14px]">Become an instructor</Button></Link>
          </div>
        </div>

        {/* Signature visual — reflects a real course from the DB instead of hardcoded sample data */}
        <div className="relative">
          {heroCourse ? (
            <>
              <Card className="p-4 max-w-sm mx-auto overflow-hidden">
                <div
                  className="h-32 rounded-lg bg-cover bg-center flex items-end p-4 mb-4"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(67,56,202,0.75), rgba(67,56,202,0.15)), url(${heroCourse.thumbnail})`,
                  }}
                >
                  <p className="font-display text-white text-lg leading-snug line-clamp-2">{heroCourse.title}</p>
                </div>
                <p className="text-[13px] text-gray-500 mb-3">By {heroCourse.teacher?.name || 'an EduSphere instructor'}</p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                  <div className="bg-success-600 h-1.5 rounded-full" style={{ width: '64%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-success-700">64% complete</span>
                  {heroCourse.totalReviews > 0 ? (
                    <Badge variant="accent">★ {heroCourse.avgRating}</Badge>
                  ) : (
                    <Badge variant="gray">New</Badge>
                  )}
                </div>
              </Card>
              <Card className="absolute -bottom-5 -left-5 p-3 max-w-[200px] hidden sm:block">
                <p className="text-[11px] text-gray-500 mb-1">This week, in a parent's view</p>
                <p className="text-[13px] font-medium text-primary-700">+3 lectures completed</p>
              </Card>
            </>
          ) : (
            <Card className="p-8 max-w-sm mx-auto text-center">
              <p className="text-[13px] text-gray-400">Courses will appear here once published.</p>
            </Card>
          )}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-14">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/courses?category=${cat._id}`}
                className="px-3.5 py-1.5 rounded-full border border-gray-200 text-[13px] text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* For everyone */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="1.8"><path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M2 8v6c0 1.5 4.5 4 10 4s10-2.5 10-4V8"/></svg>
            </div>
            <h3 className="font-medium text-[15px] mb-1.5 text-gray-900">For students</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">Buy a course once, keep it forever. Pick up exactly where you left off, on any device.</p>
          </div>
          <div>
            <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <h3 className="font-medium text-[15px] mb-1.5 text-gray-900">For instructors</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">Publish a course, set your price, and get paid out directly. No hidden platform games.</p>
          </div>
          <div>
            <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3 className="font-medium text-[15px] mb-1.5 text-gray-900">For parents</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">Link your child's account and see what they're learning, without hovering over their shoulder.</p>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      {courses.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl">Popular right now</h2>
            <Link to="/courses" className="text-[13px] text-primary-700 font-medium">See all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {courses.map((course) => (
              <Link key={course._id} to={`/courses/${course._id}`}>
                <Card hover className="overflow-hidden h-full">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="font-medium text-[13px] line-clamp-2 mb-1">{course.title}</p>
                    <p className="text-[12px] text-gray-500 mb-2">{course.teacher?.name}</p>
                    {course.totalReviews > 0 && (
                      <p className="text-[12px] text-accent-700 mb-1">★ {course.avgRating} ({course.totalReviews})</p>
                    )}
                    <p className="text-[13px] font-medium text-gray-900">
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Instructor CTA band */}
      <section className="bg-primary-800 py-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl text-white mb-1">Have something worth teaching?</h2>
            <p className="text-primary-100 text-[14px]">Join instructors already earning on EduSphere.</p>
          </div>
          <Link to="/register">
            <Button variant="accent" className="px-5 py-2.5 text-[14px]">Start teaching</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;