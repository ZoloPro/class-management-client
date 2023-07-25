import React from 'react';
import ProtectedRoute from './route/ProtectedRoute';

const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'));

const Widgets = React.lazy(() => import('./views/widgets/Widgets'));

//My custom
const Attendance = React.lazy(() => import('./views/lecturer/attendance/Checkin'));
const Grade = React.lazy(() => import('./views/lecturer/grade/Grade'));
const Document = React.lazy(() => import('./views/lecturer/document/Document'));
const Checkin = React.lazy(() => import('./views/lecturer/attendance/Checkin'));
const Password = React.lazy(() => import('./views/lecturer/password/Password'));

const Lecturer = React.lazy(() => import('./views/management/lecturer/Lecturer'));
const Student = React.lazy(() => import('./views/management/student/Student'));
const Term = React.lazy(() => import('./views/management/term/Term'));
const Classroom = React.lazy(() => import('./views/management/classroom/Classroom'));
const RegisterClassroom = React.lazy(() =>
  import('./views/management/registerClassroom/RegisterClassroom'),
);
const AddStudent = React.lazy(() => import('./views/management/registerClassroom/AddStudent'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },

  //My lecturer route
  { path: '/attendance', name: 'Attendance', element: Attendance },
  {
    path: '/grade',
    name: 'Grade',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Grade />
      </ProtectedRoute>
    ),
  },
  {
    path: '/grade/:classroomId',
    name: 'Grade',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Grade />
      </ProtectedRoute>
    ),
  },
  {
    path: '/document/:classroomId',
    name: 'Document',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Document />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkin',
    name: 'Check-in',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Checkin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkin/:classroomId',
    name: 'Check-in',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Checkin />
      </ProtectedRoute>
    ),
  },
  {
    path: '/password',
    name: 'Change password',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Password />
      </ProtectedRoute>
    ),
  },

  //My admin route
  {
    path: '/admin/lecturer',
    name: 'lecturer',
    element: (
      <ProtectedRoute role={'admin'}>
        <Lecturer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/student',
    name: 'student',
    element: (
      <ProtectedRoute role={'admin'}>
        <Student />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/term',
    name: 'term',
    element: (
      <ProtectedRoute role={'admin'}>
        <Term />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/classroom',
    name: 'classroom',
    element: (
      <ProtectedRoute role={'admin'}>
        <Classroom />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/register-classroom/:classroomId',
    name: 'register classroom',
    element: (
      <ProtectedRoute role={'admin'}>
        <RegisterClassroom />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/register-classroom/:classroomId/add',
    name: 'Add student',
    element: (
      <ProtectedRoute role={'admin'}>
        <AddStudent />
      </ProtectedRoute>
    ),
  },
];

export default routes;
