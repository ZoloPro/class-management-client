import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axiosClient from '../../../axios/axios-client';
import { useStateContext } from '../../../context/AuthContext';

const Login = () => {
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [errMsg, setErrMsg] = useState();
  const { setToken, setUser } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post('/lecturer/login', { code, password })
      .then(({ data }) => {
        setToken(data.access_token);
        setUser(data.user);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
        if (!err?.response) {
          setErrMsg('Hệ thống không phản hồi');
        } else if (err.response?.status === 400) {
          setErrMsg('Thiếu mã giảng viên hoặc mật khẩu');
        } else if (err.response?.status === 401) {
          setErrMsg('Sai mã giảng viên hoặc mật khẩu');
        } else {
          setErrMsg('Đăng nhập thất bại');
        }
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>Đăng nhập</h1>
                  <CAlert dismissible visible={errMsg ? true : false} color="warning">
                    {errMsg ? errMsg : ''}
                  </CAlert>
                  <p className="text-medium-emphasis">Đăng nhập vào tài khoản giảng viên</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Mã giảng viên"
                      autoComplete="username"
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Mật khẩu"
                      autoComplete="current-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CCol xs={6}>
                    <CButton type="submit" color="primary" className="px-4">
                      Đăng nhập
                    </CButton>
                  </CCol>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
