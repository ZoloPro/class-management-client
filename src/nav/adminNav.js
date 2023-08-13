import { CNavItem, CNavTitle } from '@coreui/react';

const adminNav = [
  {
    component: CNavTitle,
    name: 'Quản lý lớp học',
  },
  {
    component: CNavItem,
    name: 'Quản lý khoa',
    to: '/admin/department',
  },
  {
    component: CNavItem,
    name: 'Quản lý học kì',
    to: '/admin/semester',
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
  {
    component: CNavItem,
    name: 'Thông báo',
    to: '/admin/text-editor',
  },
];

export default adminNav;
