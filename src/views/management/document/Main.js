import React, { useState, useEffect } from 'react';
import Editor from './TextEditor';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  CBadge,
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';

export default function Main() {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [data, setData] = useState('');
  const [selectedType, setSelectedType] = useState('1');
  const [departments, setDepartments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [receivers, setReceivers] = useState([]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng nhập tiêu đề'),
    subtitle: Yup.string().required('Vui lòng nhập tiêu đề phụ'),
  });

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const getDepartments = () => {
    axiosClient
      .get('/admin/departments')
      .then((res) => {
        console.log(res);
        setDepartments(res.data.data.departments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getClassrooms = () => {
    axiosClient
      .get('/admin/classrooms')
      .then((res) => {
        setClassrooms(res.data.data.classrooms);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSend = async (values) => {
    const sendToast = toast.loading('Đang gửi thông báo');
    const receiverIds = await receivers.map((receiver) => receiver.id);
    axiosClient
      .post('/admin/notifications', {
        type: selectedType,
        receivers: receiverIds,
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
        // window.location.reload();
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

  const handleChangeType = (e) => {
    setReceivers([]);
    setSelectedType(e.target.value);
    if (e.target.value === '4') {
      if (departments.length === 0) {
        getDepartments();
      }
    } else if (e.target.value === '5') {
      if (classrooms.length === 0) {
        getClassrooms();
      }
    }
  };

  const handleAddReceiver = (e) => {
    if (selectedType === '4') {
      const department = departments.find((department) => department.id == e.target.value);
      const isExist = receivers.find((item) => item.id == e.target.value);
      if (!isExist) {
        setReceivers([...receivers, { id: department.id, label: department.departmentName }]);
      }
    } else if (selectedType === '5') {
      const classroom = classrooms.find((classroom) => classroom.id == e.target.value);
      const isExist = receivers.find((item) => item.id == e.target.value);
      if (!isExist) {
        setReceivers([
          ...receivers,
          { id: classroom.id, label: `${classroom.term.termName}(${classroom.id})` },
        ]);
      }
    }
  };

  const handleRemoveReceiver = (id) => {
    const newReceivers = receivers.filter((receiver) => receiver.id != id);
    setReceivers(newReceivers);
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
          type: '',
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
                Chọn lọai thông báo
              </CFormLabel>
              <CCol sm={10}>
                <CFormSelect
                  aria-label="Chọn loại thông báo"
                  onChange={handleChangeType}
                  name={'type'}
                  options={[
                    { value: '1', label: 'Toàn trường' },
                    { value: '2', label: 'Toàn giảng viên trường' },
                    { value: '3', label: 'Toàn sinh viên trường' },
                    { value: '4', label: 'Toàn sinh viên khoa' },
                    { value: '5', label: 'Toàn sinh viên lớp' },
                  ]}
                />
              </CCol>
            </CRow>
            {selectedType === '4' && (
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputTitle" className="col-sm-2 col-form-label">
                  Chọn khoa
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    aria-label="Chọn khoa"
                    name={'departments'}
                    onChange={handleAddReceiver}
                    options={[
                      { label: 'Thêm khoa' },
                      ...departments?.map((department) => ({
                        value: department.id,
                        label: department.departmentName,
                      })),
                    ]}
                  />
                </CCol>
              </CRow>
            )}
            {selectedType === '5' && (
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputTitle" className="col-sm-2 col-form-label">
                  Chọn lớp
                </CFormLabel>
                <CCol sm={10}>
                  <CFormSelect
                    aria-label="Chọn khoa"
                    name={'classrooms'}
                    onChange={handleAddReceiver}
                    options={[
                      { label: 'Thêm lớp' },
                      ...classrooms?.map((classroom) => ({
                        value: classroom.id,
                        label: `${classroom.term.termName}(${classroom.id})`,
                      })),
                    ]}
                  />
                </CCol>
              </CRow>
            )}
            {receivers.length > 0 && (
              <CRow className="mb-3">
                <CCol>
                  {receivers.map((receiver) => (
                    <CButton color="primary" key={receiver}>
                      {receiver.label}{' '}
                      <CBadge color="secondary" onClick={() => handleRemoveReceiver(receiver.id)}>
                        x
                      </CBadge>
                    </CButton>
                  ))}
                </CCol>
              </CRow>
            )}
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
