export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

// Where to send each role right after login/register
export const ROLE_HOME_ROUTE = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  student: '/student/dashboard',
  parent: '/parent/dashboard',
};

export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'];

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending_review',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
};
