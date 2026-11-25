import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchTeacherDiscussions, answerQuestion } from '../../features/discussion/discussionSlice';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const QnA = () => {
  const dispatch = useDispatch();
  const { teacherItems, loading } = useSelector((state) => state.discussion);
  const [answering, setAnswering] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [filter, setFilter] = useState('unanswered');

  useEffect(() => {
    dispatch(fetchTeacherDiscussions());
  }, [dispatch]);

  const handleAnswer = async (id) => {
    if (!answerText.trim()) return;
    const result = await dispatch(answerQuestion({ id, answer: answerText }));
    if (answerQuestion.fulfilled.match(result)) {
      toast.success('Answer posted');
      setAnswering(null);
      setAnswerText('');
    } else {
      toast.error(result.payload || 'Failed to post answer');
    }
  };

  const visibleItems = teacherItems.filter((d) =>
    filter === 'all' ? true : filter === 'unanswered' ? !d.answer : !!d.answer
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Q&A</h1>
        <div className="flex gap-2 text-sm">
          {['unanswered', 'answered', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full border ${
                filter === f ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              {f === 'unanswered' && `Unanswered (${teacherItems.filter((d) => !d.answer).length})`}
              {f === 'answered' && 'Answered'}
              {f === 'all' && 'All'}
            </button>
          ))}
        </div>
      </div>

      {visibleItems.length === 0 ? (
        <Card className="p-8 text-center text-sm text-gray-500">No questions here.</Card>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleItems.map((d) => (
            <Card key={d._id} className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium">{d.student?.name}</p>
                <Badge variant={d.answer ? 'success' : 'accent'}>{d.answer ? 'answered' : 'unanswered'}</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {d.course?.title}{d.lecture?.title && ` · ${d.lecture.title}`}
              </p>
              <p className="text-sm text-gray-800 mb-3">{d.question}</p>

              {d.answer ? (
                <div className="bg-primary-50 rounded-lg p-3">
                  <p className="text-xs text-primary-700 font-medium mb-1">Your answer</p>
                  <p className="text-sm text-gray-700">{d.answer}</p>
                </div>
              ) : answering === d._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={2}
                    placeholder="Write your answer…"
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleAnswer(d._id)}>Post answer</Button>
                    <Button variant="ghost" onClick={() => setAnswering(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => { setAnswering(d._id); setAnswerText(''); }}>
                  Reply
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QnA;