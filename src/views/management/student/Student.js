import React, { useEffect, useRef, useState } from 'react';
import { cilDataTransferUp, cilPencil, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
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

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addFormVisible, setAddFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const updateFrom = useRef();
  const addFrom = useRef();
  const importForm = useRef();

  useEffect(() => {
    getStudents();
  }, []);

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

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const toastAdd = toast.loading('Đang thêm');
    const student = {
      famMidName: addFrom.current.famMidName.value.trim(),
      name: addFrom.current.name.value.trim(),
      gender: addFrom.current.gender.value,
      birthdate: addFrom.current.birthdate.value.trim(),
      phone: addFrom.current.phone.value.trim(),
      email: addFrom.current.email.value.trim(),
    };
    axiosClient
      .post('admin/students', student)
      .then((response) => {
        console.log(response);
        addFrom.current.reset();
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
          render: 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleSubmitUpdate = (e, studentId) => {
    e.preventDefault();
    const toastUpdate = toast.loading('Đang cập nhật');
    const student = {
      famMidName: updateFrom.current.famMidName.value.trim(),
      name: updateFrom.current.name.value.trim(),
      gender: updateFrom.current.gender.value,
      birthdate: updateFrom.current.birthdate.value.trim(),
      phone: updateFrom.current.phone.value.trim(),
      email: updateFrom.current.email.value.trim(),
    };
    axiosClient
      .put(`admin/students/${studentId}`, student)
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
          render: 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleDeleteStudent = (student) => {
    if (!window.confirm(`Xác nhận xóa giảng viên ${student.fullname} (${student.code})`)) {
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
          render: 'Đã xảy ra lỗi',
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
      .post('/admin/import/students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        getStudents();
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
          render: 'Đã xảy ra lỗi',
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
          <CModalTitle>Thêm giảng viên</CModalTitle>
        </CModalHeader>
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputFamMidName" className="col-sm-3 col-form-label">
                Họ và lót
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="text" id="inputFamMidName" name="famMidName" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputName" className="col-sm-3 col-form-label">
                Tên
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="text" id="inputName" name="name" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="" className="col-sm-3 col-form-label">
                Giới tính
              </CFormLabel>
              <CCol sm={9}>
                <CFormCheck
                  inline
                  type="radio"
                  name="gender"
                  id="inlineCheckbox1"
                  value="nam"
                  label="Nam"
                />
                <CFormCheck
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
                <CFormInput type="date" id="inputBirthdate" name="birthdate" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPhone" className="col-sm-3 col-form-label">
                Điện thoại
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="tel" id="inputPhone" name="phone" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                Email
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="email" id="inputEmail" name="email" />
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
        </CForm>
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
            <CButton color="secondary" onClick={() => setImportFormVisible(false)}>
              Đóng
            </CButton>
            <CButton color="primary" type="submit">
              Thêm
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
      {selectedStudent && (
        <CModal backdrop={'static'} visible={true} onClose={() => setSelectedStudent(null)}>
          <CModalHeader>
            <CModalTitle> Cập nhật thông tin giảng viên</CModalTitle>
          </CModalHeader>
          <CForm
            ref={updateFrom}
            onSubmit={(e) => handleSubmitUpdate(e, selectedStudent.id)}
            method="POST "
          >
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
                  <CFormInput
                    type="text"
                    id="inputFamMidName"
                    name="famMidName"
                    defaultValue={selectedStudent.famMidName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputName" className="col-sm-3 col-form-label">
                  Tên
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    id="inputName"
                    name="name"
                    defaultValue={selectedStudent.name}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="" className="col-sm-3 col-form-label">
                  Giới tính
                </CFormLabel>
                <CCol sm={9}>
                  <CFormCheck
                    inline
                    type="radio"
                    name="gender"
                    id="inlineCheckbox1"
                    defaultValue="nam"
                    label="Nam"
                    defaultChecked={selectedStudent.gender == 'nam'}
                  />
                  <CFormCheck
                    inline
                    type="radio"
                    name="gender"
                    id="inlineCheckbox2"
                    defaultValue="nữ"
                    label="Nữ"
                    defaultChecked={selectedStudent.gender == 'nữ'}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputBirthdate" className="col-sm-3 col-form-label">
                  Ngày sinh
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="date"
                    id="inputBirthdate"
                    name="birthdate"
                    defaultValue={selectedStudent.birthdate}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputPhone" className="col-sm-3 col-form-label">
                  Điện thoại
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="tel"
                    id="inputPhone"
                    name="phone"
                    defaultValue={selectedStudent.phone}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputEmail" className="col-sm-3 col-form-label">
                  Email
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="email"
                    id="inputEmail"
                    name="email"
                    defaultValue={selectedStudent.email}
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
          </CForm>
        </CModal>
      )}
    </div>
  );
};

export default Student;
