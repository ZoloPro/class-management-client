import React, { useContext, useState } from 'react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { object, string } from 'yup';
import {
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
import { AuthContext } from '../../../../context/AuthContext';
import AxiosClient from '../../../../axios/axios-client';
import { toast } from 'react-toastify';

const LecturerLogin = () => {
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState(null); // Thêm state error để hiển thị thông báo lỗi
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    /*const lecturerObject = object({
      code: string().required('Mã giảng viên không được để trống'),
      password: string().required('Mật khẩu không được để trống'),
    })
    lecturerObject.validate({ code, password }).catch((err) => {
      console.log(err)
      return
    })*/
    const loginToast = toast.loading('Đang đăng nhập');
    // Thực hiện đăng nhập và nhận lại token
    AxiosClient.post('/lecturer/login', { code, password })
      .then((response) => {
        const token = response?.data?.data?.access_token;
        const user = response?.data?.data?.user;
        login(token, 'lecturer', user); // Lưu token và vai trò vào AuthContext
        navigate('/'); // Điều hướng đến trang chủ admin
        toast.dismiss(loginToast);
      })
      .catch((error) => {
        console.log(error); // Xử lý lỗi đăng nhập, hiển thị thông báo lỗi, v.v.
        toast.update(loginToast, {
          render: error?.response?.data?.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleLogin} method="POST">
                  <h1>Đăng nhập</h1>
                  <p className="text-medium-emphasis">Đăng nhập vào tài khoản giảng viên</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Mã giảng viên"
                      autoComplete="username"
                      invalid={!!error?.code}
                      feedback={error?.code}
                      required
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
                      invalid={!!error?.password}
                      feedback={error?.password}
                      required
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

export default LecturerLogin;