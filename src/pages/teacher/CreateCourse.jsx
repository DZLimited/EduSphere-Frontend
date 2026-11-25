import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCategories } from '../../features/category/categorySlice';
import { createCourse } from '../../features/course/courseSlice';
import Button from '../../components/common/Button';
import ThumbnailGenerator from '../../components/course/ThumbnailGenerator';

const CreateCourse = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories } = useSelector((state) => state.category);

  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    level: 'beginner',
    price: '',
    language: 'English',
    whatYouWillLearn: '',   // one per line in the textarea, split into array on submit
    requirements: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedCategoryName = categories.find((c) => c._id === form.category)?.name || '';

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error('Please select a category');
      return;
    }
    if (!form.thumbnail) {
      toast.error('Please wait for the thumbnail to generate, or enter a title first');
      return;
    }

    setSubmitting(true);
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      whatYouWillLearn: form.whatYouWillLearn.split('\n').map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    const result = await dispatch(createCourse(payload));
    setSubmitting(false);

    if (createCourse.fulfilled.match(result)) {
      toast.success('Course created as draft');
      navigate('/teacher/my-courses');
    } else {
      toast.error(result.payload || 'Failed to create course');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium mb-6">Create a new course</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium block mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Complete React Developer Course"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="What is this course about?"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Level</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <ThumbnailGenerator
          title={form.title}
          categoryName={selectedCategoryName}
          value={form.thumbnail}
          onChange={(dataUrl) => setForm((prev) => ({ ...prev, thumbnail: dataUrl }))}
        />

        <div>
          <label className="text-sm font-medium block mb-1">Price (USD)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="0 for free"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            What you'll learn <span className="text-gray-400">(one per line)</span>
          </label>
          <textarea
            name="whatYouWillLearn"
            value={form.whatYouWillLearn}
            onChange={handleChange}
            rows={3}
            placeholder={'Build real-world projects\nMaster React Hooks\nDeploy to production'}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Requirements <span className="text-gray-400">(one per line)</span>
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={2}
            placeholder={'Basic JavaScript knowledge'}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
          />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create course (as draft)'}
        </Button>
      </form>
    </div>
  );
};

export default CreateCourse;