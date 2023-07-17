import React, { useContext } from 'react';
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilAccountLogout, cilMenu } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

import useAuth from '../../auth/useAuth';
import axiosClient from '../../axios/axios-client';

const AppHeaderDropdown = () => {
  const { userRole, logout } = useAuth();
  const handleLogout = () => {
    axiosClient
      .get(`/${userRole}/logout`)
      .then((response) => {
        console.log(response);
        logout();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CIcon icon={cilMenu} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Tài khoản</CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Đăng xuất
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
