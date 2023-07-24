import React, { useEffect, useRef, useState } from 'react';
import { cilDataTransferUp, cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
import { ReactComponent as ExcelIcon } from '../../../assets/images/icon-excel.svg';
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
  CFormCheck,
  CRow,
  CCol,
  CFormLabel,
  CForm,
  CFormInput,
  CSpinner,
} from '@coreui/react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';

const Lecturer = () => {
  const [lectures, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addFormVisible, setAddFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const updateFrom = useRef();
  const addFrom = useRef();
  const importForm = useRef();

  useEffect(() => {
    getLecturers();
  }, []);

  const validationSchema = Yup.object().shape({
    famMidName: Yup.string().required('Vui lòng nhập họ và lót'),
    name: Yup.string().required('Vui lòng nhập tên'),
    gender: Yup.string().required('Vui lòng chọn giới tính'),
    birthdate: Yup.date().required('Vui lòng nhập ngày sinh'),
    phone: Yup.string()
      .required('Vui lòng nhập số điện thoại')
      .min(8, 'Số điện thoại không hợp lệ')
      .max(11, 'Số điện thoại không hợp lệ'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  });

  const getLecturers = () => {
    axiosClient
      .get(`/admin/lecturers`)
      .then((response) => {
        console.log(response);
        setLecturers(response?.data?.data?.lecturers);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (values) => {
    const toastAdd = toast.loading('Đang thêm');
    const lecturer = values;
    axiosClient
      .post('admin/lecturers', lecturer)
      .then((response) => {
        console.log(response);
        getLecturers();
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

  const handleDownload = (e) => {
    e.preventDefault();
    axiosClient
      .get('admin/import/lecturers/example', { responseType: 'blob' })
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

  const handleSubmitUpdate = (values, lecturerId) => {
    const toastUpdate = toast.loading('Đang cập nhật');
    const lecturer = values;
    axiosClient
      .put(`admin/lecturers/${lecturerId}`, lecturer)
      .then((response) => {
        console.log(response);
        getLecturers();
        setSelectedLecturer(null);
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

  const handleDeleteLecturer = (lecturer) => {
    if (!window.confirm(`Xác nhận xóa giảng viên ${lecturer.fullname} (${lecturer.code})`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/lecturers/${lecturer.id}`, lecturer)
      .then((response) => {
        console.log(response);
        getLecturers();
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

  const handleSubmitImport = (e) => {
    e.preventDefault();
    const toastImport = toast.loading('Đang nhập file');
    const file = importForm.current.file.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    axiosClient
      .post('/admin/import/lecturers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        getLecturers();
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

  return (
    <div>
      <CCard>
        <div className={'m-2 d-flex gap-4 justify-content-end'}>
          <CButton color="success" onClick={() => setAddFormVisible(!addFormVisible)}>
            <CIcon icon={cilPlus} /> Thêm
          </CButton>
          <CButton color="success" onClick={() => setImportFormVisible(!importFormVisible)}>
            <CIcon icon={cilDataTransferUp} />
            Nhập từ file
          </CButton>
        </div>
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
                    Mã giảng viên
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
                {lectures.map((lecturer, index) => (
                  <CTableRow key={lecturer.code}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{lecturer.code}</CTableDataCell>
                    <CTableDataCell>{lecturer.famMidName}</CTableDataCell>
                    <CTableDataCell>{lecturer.name}</CTableDataCell>
                    <CTableDataCell>{lecturer.gender}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(lecturer.birthdate).toLocaleDateString()}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedLecturer(lecturer)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDeleteLecturer(lecturer)}>
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
          <CModalTitle>Thêm giảng viên</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            famMidName: '',
            name: '',
            gender: '',
            birthdate: '',
            phone: '',
            email: '',
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
          <CModalTitle>Thêm giảng viên</CModalTitle>
        </CModalHeader>
        <CForm ref={importForm} onSubmit={handleSubmitImport} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputFile" className="col-sm-3 col-form-label">
                Chọn file
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="file" id="inputFile" name="file" />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <a onClick={handleDownload} className="fs-6 flex-grow-1" style={{ cursor: 'pointer' }}>
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
        </CForm>
      </CModal>
      {selectedLecturer && (
        <CModal backdrop={'static'} visible={true} onClose={() => setSelectedLecturer(null)}>
          <CModalHeader>
            <CModalTitle> Cập nhật thông tin giảng viên</CModalTitle>
          </CModalHeader>
          <Formik
            initialValues={{
              famMidName: selectedLecturer.famMidName,
              name: selectedLecturer.name,
              gender: selectedLecturer.gender,
              birthdate: selectedLecturer.birthdate,
              phone: selectedLecturer.phone,
              email: selectedLecturer.email,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmitUpdate(values, selectedLecturer.id)}
          >
            {({ errors, touched }) => (
              <Form as={CForm}>
                <CModalBody>
                  <CRow className="mb-3">
                    <CFormLabel htmlFor="inputCode" className="col-sm-3 col-form-label">
                      Mã sinh viên
                    </CFormLabel>
                    <CCol sm={9}>
                      <p>{selectedLecturer.code}</p>
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
                  <CButton color="secondary" onClick={() => setSelectedLecturer(null)}>
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

export default Lecturer;
