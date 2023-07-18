import React, { useEffect, useRef, useState } from 'react';
import { cilPencil, cilPlus, cilTrash } from '@coreui/icons';
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
  CRow,
  CCol,
  CFormLabel,
  CForm,
  CFormInput,
  CFormSelect,
  CSpinner,
} from '@coreui/react';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [terms, setTerms] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [loading, setLoading] = useState(true);

  const addFrom = useRef();

  useEffect(() => {
    getClassrooms();
    getLecturers();
    getTerms();
  }, []);
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

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const addToast = toast.loading('Đang thêm');
    const classroom = {
      termId: addFrom.current.term.value,
      lecturerId: addFrom.current.lecturer.value,
    };
    axiosClient
      .post('admin/classrooms', classroom)
      .then((response) => {
        console.log(response);
        addFrom.current.reset();
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

  const updateFrom = useRef();

  const handleSubmitUpdate = () => {};

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
                  <CTableHeaderCell scope="col">Mã lớp học</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Giảng viên</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Học phần</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {classrooms.map((classroom, index) => (
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
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputLecturer" className="col-sm-3 col-form-label">
                Giảng viên
              </CFormLabel>
              <CCol sm={9}>
                {
                  <CFormSelect
                    name="lecturer"
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
                Số tín chỉ
              </CFormLabel>
              <CCol sm={9}>
                {
                  <CFormSelect
                    name="term"
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
        </CForm>
      </CModal>
      {selectedClassroom && (
        <CModal visible={true} onClose={() => setSelectedClassroom(null)}>
          <CModalHeader>
            <CModalTitle>Cập nhật thông tin học phần</CModalTitle>
          </CModalHeader>
          <CForm ref={updateFrom} onSubmit={handleSubmitUpdate} method="POST ">
            <CModalBody>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputClassroomName" className="col-sm-3 col-form-label">
                  Tên học phần
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    id="inputClassroomName"
                    name="termName"
                    value={selectedClassroom.termName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputCredit" className="col-sm-3 col-form-label">
                  Số tín chỉ
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="number"
                    id="inputCredit"
                    name="credit"
                    value={selectedClassroom.credit}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setSelectedClassroom(null)}>
                Đóng
              </CButton>
              <CButton color="primary" type="submit">
                Thêm
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      )}
    </div>
  );
};

export default Classroom;
