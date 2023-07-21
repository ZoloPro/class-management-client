import React, { useRef } from 'react';
import { CCard, CRow, CCol, CFormLabel, CFormInput, CForm, CButton } from '@coreui/react';
import useAuth from '../../../auth/useAuth';
import { toast } from 'react-toastify';
import axiosClient from '../../../axios/axios-client';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const Checkin = () => {
  const updateFrom = useRef();

  const { logout } = useAuth();

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: Yup.string()
      .required('Vui lòng nhập lại mật khẩu mới')
      .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu mới không khớp'),
  });

  const handleChangePassword = (values) => {
    const updateToast = toast.loading('Đang cập nhật mật khẩu');
    axiosClient
      .post('/lecturer/password', values)
      .then((response) => {
        console.log(response);
        toast.update(updateToast, {
          render: 'Cập nhật mật khẩu thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        logout();
      })
      .catch((error) => {
        console.log(error);
        toast.update(updateToast, {
          render: error.response.data.message || 'Cập nhật mật khẩu thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div>
      <CCard>
        <div className="w-50 m-auto p-4">
          <CRow className="p-4 fs-4 fw-bold justify-content-center">Đổi mật khẩu</CRow>
          <Formik
            initialValues={{
              oldPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleChangePassword}
          >
            {({ errors, touched }) => (
              <Form as="CForm">
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputCode" className="col-sm-4 col-form-label">
                    Mật khẩu hiện tại
                  </CFormLabel>
                  <CCol sm={8}>
                    <Field
                      as={CFormInput}
                      type="password"
                      id="inputOldPassword"
                      name="oldPassword"
                      invalid={!!(touched.oldPassword && errors.oldPassword)}
                      feedback={errors.oldPassword || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputFamMidName" className="col-sm-4 col-form-label">
                    Mật khẩu mới
                  </CFormLabel>
                  <CCol sm={8}>
                    <Field
                      as={CFormInput}
                      type="password"
                      id="inputNewPassword"
                      name="newPassword"
                      invalid={!!(touched.newPassword && errors.newPassword)}
                      feedback={errors.newPassword || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputName" className="col-sm-4 col-form-label">
                    Xác nhận mật khẩu mới
                  </CFormLabel>
                  <CCol sm={8}>
                    <Field
                      as={CFormInput}
                      type="password"
                      id="inputConfirmPassword"
                      name="confirmPassword"
                      invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                      feedback={errors.confirmPassword || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="justify-content-center">
                  <CButton type="submit" className="col-2">
                    Lưu
                  </CButton>
                </CRow>
              </Form>
            )}
          </Formik>
        </div>
      </CCard>
    </div>
  );
};

export default Checkin;
