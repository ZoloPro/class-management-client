import React from 'react';
import ProtectedRoute from './route/ProtectedRoute';
import { Navigate } from 'react-router-dom';

//My custom
const Grade = React.lazy(() => import('./views/lecturer/grade/Grade'));
const Document = React.lazy(() => import('./views/lecturer/document/Document'));
const Checkin = React.lazy(() => import('./views/lecturer/checkin/Checkin'));
const CheckinHistory = React.lazy(() => import('./views/lecturer/checkin/CheckinHistory'));
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

  //My lecturer route
  {
    path: '/checkin-history',
    name: 'Check in history',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <CheckinHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkin-history/:classroomId',
    name: 'Check in history',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <CheckinHistory />
      </ProtectedRoute>
    ),
  },
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
    path: '/document',
    name: 'Document',
    element: (
      <ProtectedRoute role={'lecturer'}>
        <Document />
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
    path: '/admin',
    name: 'lecturer',
    element: <ProtectedRoute role={'admin'}></ProtectedRoute>,
  },
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
  {
    path: '*',
    name: 'Page 404',
    element: <Navigate to="404" replace />,
  },
];

export default routes;
