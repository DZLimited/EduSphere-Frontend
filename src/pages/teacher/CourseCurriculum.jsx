import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getSectionsByCourseApi, createSectionApi, deleteSectionApi } from '../../api/sectionApi';
import { createLectureApi, deleteLectureApi } from '../../api/lectureApi';
import { getCourseByIdApi } from '../../api/courseApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const CourseCurriculum = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [lectureForms, setLectureForms] = useState({}); // { [sectionId]: { title, videoUrl, duration, isPreview } }

  const loadData = async () => {
    try {
      const [courseRes, sectionsRes] = await Promise.all([
        getCourseByIdApi(courseId),
        getSectionsByCourseApi(courseId),
      ]);
      setCourse(courseRes.data.data);
      setSections(sectionsRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load curriculum');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    try {
      await createSectionApi({ course: courseId, title: newSectionTitle });
      setNewSectionTitle('');
      toast.success('Section added');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('Delete this section and all its lectures?')) return;
    try {
      await deleteSectionApi(sectionId);
      toast.success('Section deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete section');
    }
  };

  const updateLectureForm = (sectionId, field, value) => {
    setLectureForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const handleAddLecture = async (sectionId) => {
    const form = lectureForms[sectionId] || {};
    if (!form.title || !form.videoUrl || !form.duration) {
      toast.error('Title, video URL and duration are required');
      return;
    }
    try {
      await createLectureApi({
        section: sectionId,
        title: form.title,
        videoUrl: form.videoUrl,
        duration: Number(form.duration),
        isPreview: !!form.isPreview,
      });
      setLectureForms((prev) => ({ ...prev, [sectionId]: {} }));
      toast.success('Lecture added');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add lecture');
    }
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!confirm('Delete this lecture?')) return;
    try {
      await deleteLectureApi(lectureId);
      toast.success('Lecture deleted');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete lecture');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl">
      <Link to="/teacher/my-courses" className="text-sm text-primary-600">← Back to My Courses</Link>
      <h1 className="text-2xl font-medium mt-2 mb-1">{course?.title}</h1>
      <p className="text-sm text-gray-500 mb-6">Curriculum builder — add sections and lectures</p>

      {/* Add new section */}
      <form onSubmit={handleAddSection} className="flex gap-2 mb-8">
        <input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="e.g. Getting Started"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1"
        />
        <Button type="submit">+ Add section</Button>
      </form>

      {sections.length === 0 && (
        <p className="text-sm text-gray-500">No sections yet — add one above to get started.</p>
      )}

      <div className="flex flex-col gap-6">
        {sections.map((section, idx) => (
          <div key={section._id} className="border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-medium">Section {idx + 1}: {section.title}</p>
              <button
                onClick={() => handleDeleteSection(section._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete section
              </button>
            </div>

            {/* Lectures list */}
            <div className="divide-y divide-gray-100">
              {section.lectures?.map((lecture, lidx) => (
                <div key={lecture._id} className="flex items-center justify-between px-4 py-2">
                  <div className="text-sm">
                    <span className="text-gray-400 mr-2">{lidx + 1}.</span>
                    {lecture.title}
                    <span className="text-gray-400 ml-2">({Math.round(lecture.duration / 60)} min)</span>
                    {lecture.isPreview && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Free preview</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteLecture(lecture._id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {(!section.lectures || section.lectures.length === 0) && (
                <p className="px-4 py-2 text-sm text-gray-400">No lectures yet.</p>
              )}
            </div>

            {/* Add lecture form */}
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Lecture title"
                  value={lectureForms[section._id]?.title || ''}
                  onChange={(e) => updateLectureForm(section._id, 'title', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
                <input
                  placeholder="Duration in seconds"
                  type="number"
                  value={lectureForms[section._id]?.duration || ''}
                  onChange={(e) => updateLectureForm(section._id, 'duration', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                />
              </div>
              <input
                placeholder="Video URL (Cloudinary upload comes later — paste a link for now)"
                value={lectureForms[section._id]?.videoUrl || ''}
                onChange={(e) => updateLectureForm(section._id, 'videoUrl', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={!!lectureForms[section._id]?.isPreview}
                  onChange={(e) => updateLectureForm(section._id, 'isPreview', e.target.checked)}
                />
                Free preview (visible without enrolling)
              </label>
              <Button variant="secondary" onClick={() => handleAddLecture(section._id)} className="self-start">
                + Add lecture
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCurriculum;