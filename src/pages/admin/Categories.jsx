import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, removeCategory } from '../../features/category/categorySlice';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const Categories = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.category);
  const [name, setName] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const result = await dispatch(addCategory({ name }));
    if (addCategory.fulfilled.match(result)) {
      toast.success('Category created');
      setName('');
    } else {
      toast.error(result.payload || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    const result = await dispatch(removeCategory(id));
    if (removeCategory.fulfilled.match(result)) {
      toast.success('Category deleted');
    } else {
      toast.error(result.payload || 'Failed to delete category');
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-6">Categories</h1>

      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="e.g. Web Development"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] flex-1 max-w-sm focus:outline-none focus:border-primary-400"
        />
        <Button type="submit">Add category</Button>
      </form>

      {error && <p className="text-[13px] text-red-600 mb-4">{error}</p>}

      {loading ? (
        <Loader />
      ) : (
        <Card className="divide-y divide-gray-100 max-w-2xl">
          {items.length === 0 && (
            <p className="p-4 text-[13px] text-gray-500">No categories yet — add one above.</p>
          )}
          {items.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-[13px] font-medium">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(cat._id)}
                className="text-[13px] text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default Categories;