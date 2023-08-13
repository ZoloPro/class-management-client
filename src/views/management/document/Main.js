import React, { useState, useEffect } from 'react';
import Editor from './TextEditor';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { CButton, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';

export default function Main() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState('');

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tiêu đề'),
    subtitle: Yup.string().required('Vui lòng nhập tiêu đề phụ'),
  });

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const handleSend = (values) => {
    const sendToast = toast.loading('Đang gửi thông báo');
    axiosClient
      .post('/admin/notifications', {
        title: values.title,
        body: values.subtitle,
        notifyContent: data,
      })
      .then((res) => {
        console.log(res);
        toast.update(sendToast, {
          render: 'Gửi thông báo thành công',
          type: toast.TYPE.SUCCESS,
          isLoading: false,
          autoClose: 2000,
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.update(sendToast, {
          render: 'Gửi thông báo không thành công',
          type: toast.TYPE.ERROR,
          isLoading: false,
          autoClose: 2000,
        });
      });
  };

  return (
    <div>
      <CRow className="mb-4">
        <CCol className="text-end">
          <CButton type={'submit'} form={'notificationForm'}>
            Gửi đi
          </CButton>
        </CCol>
      </CRow>
      <Formik
        initialValues={{
          title: '',
          subtitle: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSend}
      >
        {({ errors, touched }) => (
          <Form as={CForm} id={'notificationForm'}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputTitle" className="col-sm-2 col-form-label">
                Tiêu đề
              </CFormLabel>
              <CCol sm={10}>
                <Field
                  as={CFormInput}
                  type="text"
                  id="inputTitle"
                  name="title"
                  invalid={!!(touched.title && errors.title)}
                  feedback={errors.title || ''}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputSubtitle" className="col-sm-2 col-form-label">
                Tiêu đề phụ
              </CFormLabel>
              <CCol sm={10}>
                <Field
                  as={CFormInput}
                  type="text"
                  id="inputSubtitle"
                  name="subtitle"
                  invalid={!!(touched.subtitle && errors.subtitle)}
                  feedback={errors.subtitle || ''}
                />
              </CCol>
            </CRow>
          </Form>
        )}
      </Formik>
      <Editor
        onChange={(data) => {
          setData(data);
        }}
        editorLoaded={editorLoaded}
      />
      {data}
    </div>
  );
}
