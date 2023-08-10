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
  CSpinner,
} from '@coreui/react';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const addFrom = useRef();
  const updateFrom = useRef();

  useEffect(() => {
    getDepartments();
  }, []);
  const getDepartments = () => {
    axiosClient
      .get(`/admin/departments`)
      .then((response) => {
        console.log(response);
        setDepartments(response?.data?.data?.departments);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const toastAdd = toast.loading('Đang thêm');
    const department = {
      departmentName: addFrom.current.departmentName.value.trim(),
    };
    axiosClient
      .post('admin/departments', department)
      .then((response) => {
        console.log(response);
        addFrom.current.reset();
        getDepartments();
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

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const toastUpdate = toast.loading('Đang cập nhật');
    const department = {
      departmentName: updateFrom.current.departmentName.value.trim(),
    };
    axiosClient
      .put(`admin/departments/${selectedDepartment.id}`, department)
      .then((response) => {
        console.log(response);
        getDepartments();
        setSelectedDepartment(null);
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

  const handleDeleteDepartment = (department) => {
    if (!window.confirm(`Xác nhận xóa khoa ${department.departmentName} (${department.id})`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/departments/${department.id}`, department)
      .then((response) => {
        console.log(response);
        getDepartments();
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
                  <CTableHeaderCell scope="col">Mã khoa</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên khoa</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {departments.map((department, index) => (
                  <CTableRow key={department.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{department.id}</CTableDataCell>
                    <CTableDataCell>{department.departmentName}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedDepartment(department)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDeleteDepartment(department)}>
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
          <CModalTitle>Thêm khoa</CModalTitle>
        </CModalHeader>
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputDepartmentName" className="col-sm-3 col-form-label">
                Tên khoa
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="text" id="inputDepartmentName" name="departmentName" />
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
      {selectedDepartment && (
        <CModal backdrop={'static'} visible={true} onClose={() => setSelectedDepartment(null)}>
          <CModalHeader>
            <CModalTitle>Cập nhật thông tin khoa</CModalTitle>
          </CModalHeader>
          <CForm ref={updateFrom} onSubmit={handleSubmitUpdate} method="POST ">
            <CModalBody>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputDepartmentName" className="col-sm-3 col-form-label">
                  Tên khoa
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    id="inputDepartmentName"
                    name="departmentName"
                    defaultValue={selectedDepartment.departmentName}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setSelectedDepartment(null)}>
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

export default Department;
