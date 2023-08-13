import React, { useEffect, useRef, useState } from 'react';
import { cilDataTransferUp, cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
import { ReactComponent as ExcelIcon } from '../../../assets/images/icon-excel.svg';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  CButton,
  CCard,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import { useParams } from 'react-router-dom';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departments, setDepartments] = useState([]);

  const [addFormVisible, setAddFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const importForm = useRef();

  const validationSchema = Yup.object().shape({
    famMidName: Yup.string().required('Vui lòng nhập họ và lót'),
    name: Yup.string().required('Vui lòng nhập tên'),
    gender: Yup.string().required('Vui lòng chọn giới tính'),
    birthdate: Yup.date().required('Vui lòng nhập ngày sinh'),
    phone: Yup.string().min(8, 'Số điện thoại không hợp lệ').max(11, 'Số điện thoại không hợp lệ'),
    email: Yup.string().email('Email không hợp lệ'),
    departmentId: Yup.string().required('Vui lòng chọn khoa'),
    enrollmentDate: Yup.date().required('Vui lòng nhập ngày nhập học'),
  });

  const importValidationSchema = Yup.object().shape({
    departmentId: Yup.string().required('Vui lòng chọn khoa'),
    file: Yup.mixed().required('Vui lòng chọn file'),
  });

  const departmentId = useParams().departmentId;

  useEffect(() => {
    getStudents();
  }, []);

  useEffect(() => {
    getDepartments();
  }, []);

  const getDepartments = () => {
    axiosClient
      .get('/admin/departments')
      .then((response) => {
        console.log(response);
        setDepartments(response?.data?.data?.departments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStudents = () => {
    axiosClient
      .get(`/admin/students`)
      .then((response) => {
        console.log(response);
        setStudents(response?.data?.data?.students);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (values) => {
    const student = values;
    const toastAdd = toast.loading('Đang thêm');
    axiosClient
      .post('admin/students', student)
      .then((response) => {
        console.log(response);
        getStudents();
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
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleSubmitUpdate = (values, studentId) => {
    const toastUpdate = toast.loading('Đang cập nhật');
    axiosClient
      .put(`admin/students/${studentId}`, values)
      .then((response) => {
        console.log(response);
        getStudents();
        setSelectedStudent(null);
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

  const handleDeleteStudent = (student) => {
    if (!window.confirm(`Xác nhận xóa sinh viên ${student.fullname} (${student.code})`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xoá');
    axiosClient
      .delete(`admin/students/${student.id}`, student)
      .then((response) => {
        console.log(response);
        getStudents();
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

  const handleSubmitImport = (values) => {
    const toastImport = toast.loading('Đang nhập file');
    const formData = new FormData();
    const file = importForm.current.file.files[0];
    formData.append('file', file);
    formData.append('departmentId', values.departmentId);
    console.log(formData);
    axiosClient
      .post('/admin/import/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        getStudents();
        setImportFormVisible(false);
        toast.update(toastImport, {
          render: 'Nhập file thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(toastImport, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleDownload = (e) => {
    e.preventDefault();
    axiosClient
      .get('admin/import/students/example', { responseType: 'blob' })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data);

        const anchorElement = document.createElement('a');

        anchorElement.href = href;

        // 1) Get the value of content-disposition header
        const contentDisposition = response.headers['content-disposition'];

        // 2) set the fileName variable to the default value
        let fileName = 'example-student.xlsx';

        // 3) if the header is set, extract the filename
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
          console.log('fileNameMatch', fileNameMatch);
          if (fileNameMatch.length === 2) {
            fileName = fileNameMatch[1];
          }
        }

        anchorElement.download = fileName || 'example-lecturers.xlsx';

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (e) => {
    setLoading(true);
    const departmentId = e.target.value;
    axiosClient
      .get('admin/students', {
        params: {
          department: departmentId,
        },
      })
      .then((response) => {
        console.log(response);
        setStudents(response?.data?.data?.students);
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
                ...departments.map((department) => ({
                  label: department.departmentName,
                  value: department.id,
                })),
              ]}
              onChange={handleFilter}
            />
          </CCol>
          <CCol className="d-flex justify-content-end gap-2">
            <CButton color="success" onClick={() => setAddFormVisible(!addFormVisible)}>
              <CIcon icon={cilPlus} /> Thêm
            </CButton>
            <CButton color="success" onClick={() => setImportFormVisible(!importFormVisible)}>
              <CIcon icon={cilDataTransferUp} />
              Nhập từ file
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
                  <CTableHeaderCell scope="col" width={'5%'}>
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Mã sinh viên
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'25%'}>
                    Họ và lót
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'25%'}>
                    Tên
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Giới tính
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'15%'}>
                    Ngày sinh
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Thao tác
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {students.map((student, index) => (
                  <CTableRow key={student.code}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{student.code}</CTableDataCell>
                    <CTableDataCell>{student.famMidName}</CTableDataCell>
                    <CTableDataCell>{student.name}</CTableDataCell>
                    <CTableDataCell>{student.gender}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(student.birthdate).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedStudent(student)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDeleteStudent(student)}>
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
          <CModalTitle> Thêm sinh viên</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            famMidName: '',
            name: '',
            gender: '',
            birthdate: '',
            phone: '',
            email: '',
            departmentId: '',
            enrollmentDate: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitAdd}
        >
          {({ errors, touched }) => (
            <Form as={CForm}>
              <CModalBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputFamMidName" className="col-sm-3 col-form-label">
                    Họ và lót
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="inputFamMidName"
                      name="famMidName"
                      invalid={!!(touched.famMidName && errors.famMidName)}
                      feedback={errors.famMidName || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputName" className="col-sm-3 col-form-label">
                    Tên
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="inputName"
                      name="name"
                      invalid={!!(touched.name && errors.name)}
                      feedback={errors.name || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="" className="col-sm-3 col-form-label">
                    Giới tính
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormCheck}
                      inline
                      type="radio"
                      name="gender"
                      id="inlineCheckbox1"
                      value="nam"
                      label="Nam"
                      invalid={!!(touched.gender && errors.gender)}
                      feedback={errors.gender || ''}
                    />
                    <Field
                      as={CFormCheck}
                      inline
                      type="radio"
                      name="gender"
                      id="inlineCheckbox2"
                      value="nữ"
                      label="Nữ"
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputBirthdate" className="col-sm-3 col-form-label">
                    Ngày sinh
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="date"
                      id="inputBirthdate"
                      name="birthdate"
                      invalid={!!(touched.birthdate && errors.birthdate)}
                      feedback={errors.birthdate || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPhone" className="col-sm-3 col-form-label">
                    Điện thoại
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="tel"
                      id="inputPhone"
                      name="phone"
                      invalid={!!(touched.phone && errors.phone)}
                      feedback={errors.phone || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                    Email
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="email"
                      id="inputEmail"
                      name="email"
                      invalid={!!(touched.email && errors.email)}
                      feedback={errors.email || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                    Khoa
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormSelect}
                      aria-label="Chọn khoa"
                      name="departmentId"
                      invalid={!!(touched.departmentId && errors.departmentId)}
                      feedback={errors.departmentId || ''}
                      options={[
                        { label: 'Chọn khoa' },
                        ...departments.map((department) => ({
                          label: department.departmentName,
                          value: department.id,
                        })),
                      ]}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                    Ngày nhập học
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="date"
                      id="inputEnrollmentDate"
                      name="enrollmentDate"
                      invalid={!!(touched.enrollmentDate && errors.enrollmentDate)}
                      feedback={errors.enrollmentDate || ''}
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
      <CModal visible={importFormVisible} onClose={() => setImportFormVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm sinh viên</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            departmentId: '',
            file: null,
          }}
          validationSchema={importValidationSchema}
          onSubmit={handleSubmitImport}
        >
          {({ errors, touched }) => (
            <Form as={CForm} ref={importForm}>
              <CModalBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                    Khoa
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormSelect}
                      aria-label="Chọn khoa"
                      name="departmentId"
                      invalid={!!(touched.departmentId && errors.departmentId)}
                      feedback={errors.departmentId || ''}
                      options={[
                        { label: 'Chọn khoa' },
                        ...departments.map((department) => ({
                          label: department.departmentName,
                          value: department.id,
                        })),
                      ]}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel
                    as={CFormInput}
                    htmlFor="inputFile"
                    className="col-sm-3 col-form-label"
                  >
                    Chọn file
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="file"
                      id="inputFile"
                      name="file"
                      invalid={!!(touched.file && errors.file)}
                      feedback={errors.file || ''}
                    />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <a
                  onClick={handleDownload}
                  className="fs-6 flex-grow-1"
                  style={{ cursor: 'pointer' }}
                >
                  <ExcelIcon style={{ height: '32px' }} />
                  File mẫu
                </a>
                <CButton color="secondary" onClick={() => setImportFormVisible(false)}>
                  Đóng
                </CButton>
                <CButton color="primary" type="submit">
                  Nhập
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModal>
      {selectedStudent && (
        <CModal backdrop={'static'} visible={true} onClose={() => setSelectedStudent(null)}>
          <CModalHeader>
            <CModalTitle> Cập nhật thông tin sinh viên</CModalTitle>
          </CModalHeader>
          <Formik
            initialValues={{
              famMidName: selectedStudent.famMidName,
              name: selectedStudent.name,
              gender: selectedStudent.gender,
              birthdate: selectedStudent.birthdate,
              phone: selectedStudent.phone,
              email: selectedStudent.email,
              department: selectedStudent.department,
              enrollmentDate: selectedStudent.enrollmentDate,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmitUpdate(values, selectedStudent.id)}
          >
            {({ errors, touched }) => (
              <Form as={CForm}>
                <CModalBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputCode" className="col-sm-3 col-form-label">
                      Mã sinh viên
                    </CFormLabel>
                    <CCol sm={9}>
                      <p>{selectedStudent.code}</p>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputFamMidName" className="col-sm-3 col-form-label">
                      Họ và lót
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="text"
                        id="inputFamMidName"
                        name="famMidName"
                        invalid={!!(touched.famMidName && errors.famMidName)}
                        feedback={errors.famMidName || ''}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputName" className="col-sm-3 col-form-label">
                      Tên
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="text"
                        id="inputName"
                        name="name"
                        invalid={!!(touched.name && errors.name)}
                        feedback={errors.name || ''}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="" className="col-sm-3 col-form-label">
                      Giới tính
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormCheck}
                        inline
                        type="radio"
                        name="gender"
                        id="inlineCheckbox1"
                        value="nam"
                        label="Nam"
                        invalid={!!(touched.gender && errors.gender)}
                        feedback={errors.gender || ''}
                      />
                      <Field
                        as={CFormCheck}
                        inline
                        type="radio"
                        name="gender"
                        id="inlineCheckbox2"
                        value="nữ"
                        label="Nữ"
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputBirthdate" className="col-sm-3 col-form-label">
                      Ngày sinh
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="date"
                        id="inputBirthdate"
                        name="birthdate"
                        invalid={!!(touched.birthdate && errors.birthdate)}
                        feedback={errors.birthdate || ''}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputPhone" className="col-sm-3 col-form-label">
                      Điện thoại
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="tel"
                        id="inputPhone"
                        name="phone"
                        invalid={!!(touched.phone && errors.phone)}
                        feedback={errors.phone || ''}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                      Email
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="email"
                        id="inputEmail"
                        name="email"
                        invalid={!!(touched.email && errors.email)}
                        feedback={errors.email || ''}
                      />
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                      Ngày nhập học
                    </CFormLabel>
                    <CCol sm={9}>
                      <Field
                        as={CFormInput}
                        type="date"
                        id="inputEnrollmentDate"
                        name="enrollmentDate"
                        invalid={!!(touched.enrollmentDate && errors.enrollmentDate)}
                        feedback={errors.enrollmentDate || ''}
                      />
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setSelectedStudent(null)}>
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

export default Student;
