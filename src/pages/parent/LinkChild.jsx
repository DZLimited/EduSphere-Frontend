import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { sendLinkRequest, fetchMyChildren } from '../../features/parent/parentSlice';
import Button from '../../components/common/Button';

const LinkChild = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.parent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(sendLinkRequest(email));
    if (sendLinkRequest.fulfilled.match(result)) {
      toast.success('Request sent — waiting for the student to approve');
      setEmail('');
      dispatch(fetchMyChildren());
    } else {
      toast.error(result.payload || 'Failed to send request');
    }
  };

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-medium mb-4">Link a child's account</h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter your child's EduSphere account email. They'll need to approve the request before you can see their progress.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="child@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit">Send request</Button>
      </form>
    </div>
  );
};

export default LinkChild;