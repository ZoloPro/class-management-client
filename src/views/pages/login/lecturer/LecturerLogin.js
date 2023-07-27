import React, { useContext } from 'react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
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
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Vui lòng nhập mã giảng viên'),
    password: Yup.string().required('Vui lòng nhập mật khẩu'),
  });

  const handleLogin = (values) => {
    const loginToast = toast.loading('Đang đăng nhập');
    // Thực hiện đăng nhập và nhận lại token
    AxiosClient.post('/lecturer/login', values)
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
          render: error.response.data.message || 'Đã xảy ra lỗi',
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
                <Formik
                  initialValues={{
                    code: '',
                    password: '',
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleLogin}
                >
                  {({ errors, touched }) => (
                    <Form as={CForm}>
                      <h1>Đăng nhập</h1>
                      <p className="text-medium-emphasis">Đăng nhập vào tài khoản giảng viên</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <Field
                          as={CFormInput}
                          placeholder="Mã giảng viên"
                          autoComplete="code"
                          name="code"
                          invalid={!!(touched.code && errors.code)}
                          feedback={errors.code || ''}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <Field
                          as={CFormInput}
                          type="password"
                          placeholder="Mật khẩu"
                          autoComplete="current-password"
                          name="password"
                          invalid={!!(touched.password && errors.password)}
                          feedback={errors.password || ''}
                        />
                      </CInputGroup>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          Đăng nhập
                        </CButton>
                      </CCol>
                    </Form>
                  )}
                </Formik>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LecturerLogin;
