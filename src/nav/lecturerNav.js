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
    name: 'Điểm danh',
    to: '/checkin',
  },
  {
    component: CNavItem,
    name: 'Lịch sử điểm danh',
    to: '/checkin-history',
  },
  {
    component: CNavItem,
    name: 'Nhập điểm',
    to: '/grade',
  },
  {
    component: CNavItem,
    name: 'Tài liệu',
    to: '/document',
  },
];

export default adminNav;
