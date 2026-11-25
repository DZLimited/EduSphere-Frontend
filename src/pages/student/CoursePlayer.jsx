import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCourseDiscussions, askQuestion, clearCourseDiscussions } from '../../features/discussion/discussionSlice';
import { fetchCurriculum, clearCurriculum } from '../../features/curriculum/curriculumSlice';
import { getCourseProgressApi, updateLectureProgressApi } from '../../api/progressApi';
import Loader from '../../components/common/Loader';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sections, loading: curriculumLoading } = useSelector((state) => state.curriculum);

  const [progressMap, setProgressMap] = useState({}); // { [lectureId]: { isCompleted, lastWatchedSeconds } }
  const [enrollment, setEnrollment] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [progressLoading, setProgressLoading] = useState(true);

  const discussions = useSelector((state) => state.discussion.courseItems);
  const [newQuestion, setNewQuestion] = useState('');

  // Load curriculum + progress + discussions together
  useEffect(() => {
    dispatch(fetchCurriculum(courseId));
    dispatch(fetchCourseDiscussions(courseId));

    getCourseProgressApi(courseId)
      .then(({ data }) => {
        const map = {};
        data.data.progress.forEach((p) => {
          map[p.lecture] = { isCompleted: p.isCompleted, lastWatchedSeconds: p.lastWatchedSeconds };
        });
        setProgressMap(map);
        setEnrollment(data.data.enrollment);
      })
      .catch(() => toast.error('You must be enrolled to view this course'))
      .finally(() => setProgressLoading(false));

    return () => {
      dispatch(clearCurriculum());
      dispatch(clearCourseDiscussions());
    };
  }, [dispatch, courseId]);

  // Auto-select the first lecture once curriculum loads
  useEffect(() => {
    if (!activeLecture && sections.length > 0 && sections[0].lectures.length > 0) {
      setActiveLecture(sections[0].lectures[0]);
    }
  }, [sections, activeLecture]);

  const handleMarkComplete = async (lecture) => {
    try {
      const { data } = await updateLectureProgressApi(lecture._id, { isCompleted: true });
      setProgressMap((prev) => ({ ...prev, [lecture._id]: { ...prev[lecture._id], isCompleted: true } }));
      setEnrollment(data.data.enrollment);
      toast.success('Marked as complete');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const handleVideoEnded = () => {
    if (activeLecture && !progressMap[activeLecture._id]?.isCompleted) {
      handleMarkComplete(activeLecture);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !activeLecture) return;
    const result = await dispatch(askQuestion({ course: courseId, lecture: activeLecture._id, question: newQuestion }));
    if (askQuestion.fulfilled.match(result)) {
      toast.success('Question submitted');
      setNewQuestion('');
    } else {
      toast.error(result.payload || 'Failed to submit question');
    }
  };

  if (curriculumLoading || progressLoading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row gap-6 -m-6">
      {/* Video area */}
      <div className="flex-1 bg-black p-6 flex flex-col">
        <Link to="/student/my-learning" className="text-white text-sm mb-4 inline-block">
          ← Back to My Learning
        </Link>

        {activeLecture ? (
          <>
            <video
              key={activeLecture._id}
              src={activeLecture.videoUrl}
              controls
              className="w-full max-h-[480px] bg-black rounded-lg"
              onEnded={handleVideoEnded}
            />
            <div className="text-white mt-4 flex items-center justify-between">
              <h2 className="font-medium">{activeLecture.title}</h2>
              {progressMap[activeLecture._id]?.isCompleted ? (
                <span className="text-xs bg-green-600 px-2 py-1 rounded-full">Completed</span>
              ) : (
                <button
                  onClick={() => handleMarkComplete(activeLecture)}
                  className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg"
                >
                  Mark as complete
                </button>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium mb-3">Questions on this lecture</h3>
              <form onSubmit={handleAskQuestion} className="flex gap-2 mb-4">
                <input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask the instructor a question…"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
                />
                <button type="submit" className="bg-primary-700 text-white text-sm px-4 py-2 rounded-lg">Ask</button>
              </form>

              <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
                {discussions.filter((d) => d.lecture === activeLecture._id).length === 0 && (
                  <p className="text-xs text-gray-400">No questions yet for this lecture.</p>
                )}
                {discussions.filter((d) => d.lecture === activeLecture._id).map((d) => (
                  <div key={d._id} className="border-b border-gray-100 pb-2">
                    <p className="text-xs font-medium text-gray-700">{d.student?.name}</p>
                    <p className="text-sm text-gray-800">{d.question}</p>
                    {d.answer && (
                      <div className="bg-primary-50 rounded-lg p-2 mt-1">
                        <p className="text-xs text-primary-700 font-medium">Instructor replied</p>
                        <p className="text-sm text-gray-700">{d.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-white">No lectures available yet.</p>
        )}
      </div>

      {/* Curriculum sidebar */}
      <div className="w-full md:w-80 bg-white border-l border-gray-200 overflow-y-auto max-h-screen">
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm font-medium">Course progress</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-primary-600 h-1.5 rounded-full"
              style={{ width: `${enrollment?.progressPercent || 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{enrollment?.progressPercent || 0}% complete</p>
        </div>

        {sections.map((section) => (
          <div key={section._id} className="border-b border-gray-100">
            <p className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50">{section.title}</p>
            {section.lectures.map((lecture) => {
              const isActive = activeLecture?._id === lecture._id;
              const isDone = progressMap[lecture._id]?.isCompleted;
              return (
                <button
                  key={lecture._id}
                  onClick={() => setActiveLecture(lecture)}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                    isActive ? 'bg-primary-50 text-primary-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex-shrink-0 ${isDone ? 'bg-primary-600 border-primary-600' : 'border-gray-300'}`} />
                  <span className="flex-1 line-clamp-2">{lecture.title}</span>
                  <span className="text-xs text-gray-400">{Math.round(lecture.duration / 60)}m</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;