import React, { useEffect, useState } from 'react';
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
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
  CFormSelect,
  CSpinner,
  CFormInput,
} from '@coreui/react';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [terms, setTerms] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    getClassrooms();
    getSemesters();
    getLecturers();
    getTerms();
  }, []);

  const validationSchema = Yup.object().shape({
    term: Yup.string().required('Vui lòng chọn học phần'),
    lecturer: Yup.string().required('Vui lòng chọn giảng viên'),
  });

  const addValidationSchema = Yup.object().shape({
    semesterId: Yup.string().required('Vui lòng chọn học kỳ'),
    term: Yup.string().required('Vui lòng chọn học phần'),
    lecturer: Yup.string().required('Vui lòng chọn giảng viên'),
  });

  const getSemesters = () => {
    axiosClient
      .get(`/admin/semesters`)
      .then((response) => {
        console.log(response);
        setSemesters(response?.data?.data?.semesters);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClassrooms = () => {
    axiosClient
      .get(`/admin/classrooms`)
      .then((response) => {
        console.log(response);
        setClassrooms(response?.data?.data?.classrooms);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getTerms = () => {
    axiosClient
      .get(`/admin/terms`)
      .then((response) => {
        console.log(response);
        setTerms(response?.data?.data?.terms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLecturers = () => {
    axiosClient
      .get(`/admin/lecturers`)
      .then((response) => {
        console.log(response);
        setLecturers(response?.data?.data?.lecturers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (values) => {
    const addToast = toast.loading('Đang thêm');
    axiosClient
      .post('admin/classrooms', {
        semesterId: values.semesterId,
        termId: values.term,
        lecturerId: values.lecturer,
      })
      .then((response) => {
        console.log(response);
        getClassrooms();
        setAddFormVisible(false);
        toast.update(addToast, {
          render: 'Thêm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(addToast, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleSubmitUpdate = (values) => {
    const addToast = toast.loading('Đang cập nhật');
    const classroomId = values.id;
    axiosClient
      .put(`admin/classrooms/${classroomId}`, {
        termId: values.term,
        lecturerId: values.lecturer,
      })
      .then((response) => {
        console.log(response);
        getClassrooms();
        setSelectedClassroom(null);
        toast.update(addToast, {
          render: 'Cập nhật thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(addToast, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleDelete = (classroom) => {
    if (
      !window.confirm(
        `Xác nhận xóa lớp học ${classroom.term.termName} (${classroom.lecturer.fullname})`,
      )
    ) {
      return;
    }
    const deleteToast = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/classrooms/${classroom.id}`, classroom)
      .then((response) => {
        console.log(response);
        getClassrooms();
        toast.update(deleteToast, {
          render: 'Xóa thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(deleteToast, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleFilter = (e) => {
    setLoading(true);
    const semesterId = e.target.value;
    axiosClient
      .get('admin/classrooms', {
        params: {
          semester: semesterId,
        },
      })
      .then((response) => {
        console.log(response);
        setClassrooms(response?.data?.data?.classrooms);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <CCard>
        <CRow className="p-2">
          <CCol sm={3}>
            <CFormSelect
              aria-label="Chọn khoa"
              options={[
                { label: 'Tất cả', value: '' },
                ...semesters.map((semester) => ({
                  label: semester.semesterName,
                  value: semester.id,
                })),
              ]}
              onChange={handleFilter}
            />
          </CCol>
          <CCol className="d-flex justify-content-end gap-2">
            <CButton color="success" onClick={() => setAddFormVisible(!addFormVisible)}>
              <CIcon icon={cilPlus} /> Thêm
            </CButton>
          </CCol>
        </CRow>
        <div className={'m-2'}>
          {loading ? (
            <CSpinner />
          ) : (
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mã lớp học</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Giảng viên</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Học phần</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {classrooms?.map((classroom, index) => (
                  <CTableRow key={classroom.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{classroom.id}</CTableDataCell>
                    <CTableDataCell>
                      {`${classroom.lecturer.fullname} (${classroom.lecturer.code})`}
                    </CTableDataCell>
                    <CTableDataCell>{`${classroom.term.termName} (${classroom.term.id})`}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedClassroom(classroom)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDelete(classroom)}>
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
          <CModalTitle>Thêm lớp</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            semesterId: '',
            lecturer: '',
            term: '',
          }}
          onSubmit={handleSubmitAdd}
          validationSchema={addValidationSchema}
        >
          {({ errors, touched }) => (
            <Form as={CForm}>
              <CModalBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputTerm" className="col-sm-3 col-form-label">
                    Chọn học kì
                  </CFormLabel>
                  <CCol sm={9}>
                    {
                      <Field
                        as={CFormSelect}
                        name="semesterId"
                        invalid={errors.semesterId && touched.semesterId}
                        feedback={errors.semesterId}
                        options={[
                          'Chọn học kì',
                          ...semesters.map((semester) => ({
                            label: `${semester.semesterName} (${semester.id})`,
                            value: semester.id,
                          })),
                        ]}
                      />
                    }
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputLecturer" className="col-sm-3 col-form-label">
                    Giảng viên
                  </CFormLabel>
                  <CCol sm={9}>
                    {
                      <Field
                        as={CFormSelect}
                        name="lecturer"
                        invalid={errors.lecturer && touched.lecturer}
                        feedback={errors.lecturer}
                        options={[
                          'Chọn giảng viên',
                          ...lecturers.map((lecturer) => ({
                            label: `${lecturer.fullname} (${lecturer.code})`,
                            value: lecturer.id,
                          })),
                        ]}
                      />
                    }
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputTerm" className="col-sm-3 col-form-label">
                    Chọn học phần
                  </CFormLabel>
                  <CCol sm={9}>
                    {
                      <Field
                        as={CFormSelect}
                        name="term"
                        invalid={errors.term && touched.term}
                        feedback={errors.term}
                        options={[
                          'Chọn học phần',
                          ...terms.map((term) => ({
                            label: `${term.termName} (${term.id})`,
                            value: term.id,
                          })),
                        ]}
                      />
                    }
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
      {selectedClassroom && (
        <CModal visible={true} backdrop="static" onClose={() => setSelectedClassroom(null)}>
          <CModalHeader>
            <CModalTitle>Cập nhật thông tin lớp học</CModalTitle>
          </CModalHeader>
          <Formik
            initialValues={{
              id: selectedClassroom.id,
              lecturer: selectedClassroom.lecturer.id,
              term: selectedClassroom.term.id,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitUpdate}
          >
            {({ errors, touched }) => (
              <Form as={CForm}>
                <CModalBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputLecturer" className="col-sm-3 col-form-label">
                      Giảng viên
                    </CFormLabel>
                    <CCol sm={9}>
                      {
                        <Field
                          as={CFormSelect}
                          name="lecturer"
                          invalid={errors.lecturer && touched.lecturer}
                          feedback={errors.lecturer}
                          options={[
                            'Chọn giảng viên',
                            ...lecturers.map((lecturer) => ({
                              label: `${lecturer.fullname} (${lecturer.code})`,
                              value: lecturer.id,
                            })),
                          ]}
                        />
                      }
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputTerm" className="col-sm-3 col-form-label">
                      Chọn học phần
                    </CFormLabel>
                    <CCol sm={9}>
                      {
                        <Field
                          as={CFormSelect}
                          name="term"
                          invalid={errors.term && touched.term}
                          feedback={errors.term}
                          options={[
                            'Chọn học phần',
                            ...terms.map((term) => ({
                              label: `${term.termName} (${term.id})`,
                              value: term.id,
                            })),
                          ]}
                        />
                      }
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setSelectedClassroom(null)}>
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

export default Classroom;
