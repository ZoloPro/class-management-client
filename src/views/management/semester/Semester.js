import React, { useEffect, useRef, useState } from 'react';
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormLabel,
  CForm,
  CFormInput,
  CSpinner,
} from '@coreui/react';

const Semester = () => {
  const [semesters, setSemesters] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const addFrom = useRef();
  const updateFrom = useRef();

  const validationSchema = Yup.object().shape({
    semesterName: Yup.string().required('Vui lòng nhập tên học kỳ'),
    startDate: Yup.date().required('Vui lòng nhập ngày bắt đầu'),
    endDate: Yup.date()
      .required('Vui lòng nhập ngày kết thúc')
      .min(Yup.ref('startDate'), 'Ngày kết thúc phải sau ngày bắt đầu'),
  });

  const updateValidationSchema = Yup.object().shape({
    semesterName: Yup.string().required('Vui lòng nhập tên học kỳ'),
  });

  useEffect(() => {
    getSemesters();
  }, []);
  const getSemesters = () => {
    axiosClient
      .get(`/admin/semesters`)
      .then((response) => {
        console.log(response);
        setSemesters(response?.data?.data?.semesters);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (values) => {
    const toastAdd = toast.loading('Đang thêm');
    axiosClient
      .post('admin/semesters', values)
      .then((response) => {
        console.log(response);
        getSemesters();
        setAddFormVisible(false);
        toast.update(toastAdd, {
          render: 'Thêm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(toastAdd, {
          render: error?.response?.data?.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleSubmitUpdate = (values) => {
    const toastUpdate = toast.loading('Đang cập nhật');
    axiosClient
      .put(`admin/semesters/${selectedSemester.id}`, values)
      .then((response) => {
        console.log(response);
        getSemesters();
        setSelectedSemester(null);
        toast.update(toastUpdate, {
          render: 'Cập nhật thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(toastUpdate, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleDeleteSemester = (semester) => {
    if (!window.confirm(`Xác nhận xóa học kì ${semester.semesterName}`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/semesters/${semester.id}`, semester)
      .then((response) => {
        console.log(response);
        getSemesters();
        toast.update(toastDelete, {
          render: 'Xóa thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(toastDelete, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
    <div>
      <CCard>
        <div className={'m-2 d-flex gap-4 justify-content-end'}>
          <CButton color="success" onClick={() => setAddFormVisible(!addFormVisible)}>
            <CIcon icon={cilPlus} /> Thêm
          </CButton>
        </div>
        <div className={'m-2'}>
          {loading ? (
            <CSpinner />
          ) : (
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mã học kì</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên học kì</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày bắt đầu</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Ngày kết thúc</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {semesters.map((semester, index) => (
                  <CTableRow key={semester.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{semester.id}</CTableDataCell>
                    <CTableDataCell>{semester.semesterName}</CTableDataCell>
                    <CTableDataCell>{semester.startDate}</CTableDataCell>
                    <CTableDataCell>{semester.endDate}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedSemester(semester)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDeleteSemester(semester)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </div>
      </CCard>
      <CModal visible={addFormVisible} onClose={() => setAddFormVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm học phần</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            semesterName: '',
            startDate: '',
            endDate: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitAdd}
        >
          {({ errors, touched }) => (
            <Form as={CForm}>
              <CModalBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputSemesterName" className="col-sm-3 col-form-label">
                    Tên học phần
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="inputSemesterName"
                      name="semesterName"
                      invalid={!!(touched.semesterName && errors.semesterName)}
                      feedback={errors.semesterName || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputStartDate" className="col-sm-3 col-form-label">
                    Ngày bắt đầu
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="date"
                      id="inputStartDate"
                      name="startDate"
                      invalid={!!(touched.startDate && errors.startDate)}
                      feedback={errors.startDate || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEndDate" className="col-sm-3 col-form-label">
                    Ngày bắt đầu
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="date"
                      id="inputEndDate"
                      name="endDate"
                      invalid={!!(touched.endDate && errors.endDate)}
                      feedback={errors.endDate || ''}
                    />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAddFormVisible(false)}>
                  Đóng
                </CButton>
                <CButton color="primary" type="submit">
                  Thêm
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModal>
      {selectedSemester && (
        <CModal visible={selectedSemester} onClose={() => setSelectedSemester(null)}>
          <CModalHeader>
            <CModalTitle>Cập nhật học phần</CModalTitle>
          </CModalHeader>
          <Formik
            initialValues={{
              semesterName: selectedSemester.semesterName,
            }}
            validationSchema={updateValidationSchema}
            onSubmit={handleSubmitUpdate}
          >
            {({ errors, touched }) => (
              <Form as={CForm}>
                <CModalBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputSemesterName" className="col-sm-3 col-form-label">
                      Tên học phần
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="text"
                        id="inputSemesterName"
                        name="semesterName"
                        invalid={!!(touched.semesterName && errors.semesterName)}
                        feedback={errors.semesterName || ''}
                      />
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setSelectedSemester(null)}>
                    Đóng
                  </CButton>
                  <CButton color="primary" type="submit">
                    Cập nhật
                  </CButton>
                </CModalFooter>
              </Form>
            )}
          </Formik>
        </CModal>
      )}
    </div>
  );
};
export default Semester;
