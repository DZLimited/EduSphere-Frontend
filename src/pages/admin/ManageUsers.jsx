import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAllUsers, blockUser, unblockUser, deleteUser } from '../../features/admin/adminSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const roleBadgeVariant = { admin: 'primary', teacher: 'accent', student: 'success', parent: 'gray' };

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllUsers(roleFilter ? { role: roleFilter } : undefined));
  }, [dispatch, roleFilter]);

  const handleToggleBlock = async (user) => {
    const action = user.isBlocked ? unblockUser : blockUser;
    const result = await dispatch(action(user._id));
    if (action.fulfilled.match(result)) {
      toast.success(user.isBlocked ? 'User unblocked' : 'User blocked');
    } else {
      toast.error(result.payload || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    const result = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(result)) toast.success('User deleted');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Manage users</h1>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary-400"
        >
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="parent">Parents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Card className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between px-4 py-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium">{user.name}</p>
                  <Badge variant={roleBadgeVariant[user.role]}>{user.role}</Badge>
                  {user.isBlocked && <Badge variant="danger">blocked</Badge>}
                </div>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              {user.role !== 'admin' && (
                <div className="flex gap-3">
                  <button onClick={() => handleToggleBlock(user)} className="text-[13px] text-gray-600 hover:underline">
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="text-[13px] text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};

export default ManageUsers;