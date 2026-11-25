import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchMyCourses,
  submitCourse,
  deleteCourse,
} from "../../features/course/courseSlice";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";

const statusStyles = {
  draft: "bg-gray-100 text-gray-700",
  pending_review: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MyCourses = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchMyCourses());
  }, [dispatch]);

  const handleSubmit = async (id) => {
    const result = await dispatch(submitCourse(id));
    if (submitCourse.fulfilled.match(result)) {
      toast.success("Submitted for review");
    } else {
      toast.error(result.payload || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    const result = await dispatch(deleteCourse(id));
    if (deleteCourse.fulfilled.match(result)) {
      toast.success("Course deleted");
    } else {
      toast.error(result.payload || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">My Courses</h1>
        <Link to="/teacher/create-course">
          <Button>+ New course</Button>
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven't created any courses yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {items.map((course) => (
            <div
              key={course._id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-500">
                  {course.category?.name} · {course.level}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${statusStyles[course.status]}`}
                >
                  {course.status.replace("_", " ")}
                </span>
                {course.status === "rejected" && course.rejectionReason && (
                  <p className="text-xs text-red-600 mt-1">
                    Reason: {course.rejectionReason}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link to={`/teacher/course/${course._id}/curriculum`}>
                  <Button variant="outline">Manage curriculum</Button>
                </Link>
                {(course.status === "draft" ||
                  course.status === "rejected") && (
                  <Button
                    variant="secondary"
                    onClick={() => handleSubmit(course._id)}
                  >
                    Submit for review
                  </Button>
                )}
                <button
                  onClick={() => handleDelete(course._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
