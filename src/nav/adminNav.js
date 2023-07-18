import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const adminNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Quản lý lớp học',
  },
  {
    component: CNavItem,
    name: 'Quản lý giảng viên',
    to: '/admin/lecturer',
  },
  {
    component: CNavItem,
    name: 'Quản lý sinh viên',
    to: '/admin/student',
  },
  {
    component: CNavItem,
    name: 'Quản lý học phần',
    to: '/admin/term',
  },
  {
    component: CNavItem,
    name: 'Quản lý lớp học',
    to: '/admin/classroom',
  },
  {
    component: CNavItem,
    name: 'Quản lý đăng kí lớp học',
    to: '/admin/register-classroom/1',
  },
];

export default adminNav;
