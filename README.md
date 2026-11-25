# EduSphere Frontend — Folder Structure Guide

Stack: React 18 (Vite) + Redux Toolkit + React Router v6 + TailwindCSS + Axios

```
frontend/
├── public/
├── src/
│   ├── api/                  # Axios instance + one file per resource (authApi.js, courseApi.js...)
│   │
│   ├── app/
│   │   └── store.js           # Redux Toolkit store — combines all feature slices
│   │
│   ├── features/               # Redux slices, one folder per domain
│   │   ├── auth/authSlice.js       ✅ fully implemented (login/register/getMe thunks)
│   │   ├── course/courseSlice.js   🔲 Phase 4
│   │   ├── cart/cartSlice.js       🔲 Phase 4
│   │   ├── enrollment/...          🔲 Phase 4
│   │   └── notification/...        🔲 Phase 4
│   │
│   ├── components/
│   │   ├── common/            # Button, Loader, Modal, Input — shared everywhere
│   │   ├── course/            # CourseCard, CurriculumBuilder, etc. (Phase 4)
│   │   └── layout/             # Navbar, Sidebar, Footer pieces (Phase 4)
│   │
│   ├── layouts/                # One shell per role — sidebar/nav differs by role
│   │   ├── PublicLayout.jsx    ✅ implemented (navbar + footer)
│   │   ├── StudentLayout.jsx   🔲 sidebar stub
│   │   ├── TeacherLayout.jsx   🔲 sidebar stub
│   │   ├── ParentLayout.jsx    🔲 sidebar stub
│   │   └── AdminLayout.jsx     🔲 sidebar stub
│   │
│   ├── pages/                  # Route-level components, grouped by role
│   │   ├── public/             # Home, CourseListing, CourseDetails, Login ✅, Register ✅
│   │   ├── student/             # Dashboard, MyLearning, CoursePlayer, Wishlist, Cart, Checkout
│   │   ├── teacher/              # Dashboard, MyCourses, CreateCourse, Earnings, QnA
│   │   ├── parent/                # Dashboard, ChildProgress, LinkChild
│   │   └── admin/                  # Dashboard, ManageUsers, ManageCourses, Coupons, Payouts, Settings
│   │
│   ├── routes/
│   │   ├── ProtectedRoute.jsx   # Blocks unauthenticated users
│   │   └── RoleRoute.jsx        # Blocks users whose role isn't in allowedRoles
│   │
│   ├── hooks/
│   │   └── useAuth.js           # Quick access to current user + role
│   │
│   ├── utils/
│   │   └── constants.js         # ROLES, COURSE_LEVELS, COURSE_STATUS enums
│   │
│   ├── styles/index.css         # Tailwind directives
│   ├── App.jsx                  # Full routing tree — public + 4 role-based route groups
│   └── main.jsx                 # Mounts React app with Redux <Provider>
│
├── index.html
├── vite.config.js               # Dev server proxies /api to backend on :5000
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env.example
└── .gitignore
```

## How to run

```bash
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

Make sure your backend is running on `http://localhost:5000` first — the Vite dev server proxies `/api/*` requests to it (see `vite.config.js`), so you don't hit CORS issues locally.

## Routing architecture

```
/                          → Public (Home, Courses, Login, Register)
/student/*                 → ProtectedRoute → RoleRoute(student) → StudentLayout → pages
/teacher/*                 → ProtectedRoute → RoleRoute(teacher) → TeacherLayout → pages
/parent/*                  → ProtectedRoute → RoleRoute(parent)  → ParentLayout  → pages
/admin/*                   → ProtectedRoute → RoleRoute(admin)   → AdminLayout   → pages
```

`ProtectedRoute` checks `isAuthenticated` from the Redux auth slice. `RoleRoute` checks `user.role` against an `allowedRoles` array. Both redirect (`/login` or `/unauthorized`) rather than rendering nothing, so the UX is always clear.

## What's implemented vs. stubbed

- **Fully working**: Redux store, Axios instance with JWT interceptor + auto-logout on 401, `authSlice` (login/register/getMe), Login & Register pages wired end-to-end to your backend Auth module, full routing tree with role guards.
- **Stubbed (🔲)**: Every dashboard/feature page renders a placeholder so you can navigate the whole app today and confirm routing/guards work per role. We build these out in Phase 4, in step with the backend modules (Category/Course pages once Course API is done, Cart/Checkout once payment is done, etc.)

## Next: real UI design

The stub pages are intentionally plain — once we implement each module's real UI (course cards, curriculum builder, video player, dashboards), we'll do a proper design pass with real visual identity, not default Tailwind styling.
