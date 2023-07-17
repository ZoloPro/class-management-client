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

const Term = () => {
  const [terms, setTerms] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [loading, setLoading] = useState(true);

  const addFrom = useRef();
  const updateFrom = useRef();

  useEffect(() => {
    getTerms();
  }, []);
  const getTerms = () => {
    axiosClient
      .get(`/admin/terms`)
      .then((response) => {
        console.log(response);
        setTerms(response?.data?.data?.terms);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const toastAdd = toast.loading('Đang thêm');
    const term = {
      termName: addFrom.current.termName.value.trim(),
      credit: addFrom.current.credit.value.trim(),
    };
    axiosClient
      .post('admin/terms', term)
      .then((response) => {
        console.log(response);
        addFrom.current.reset();
        getTerms();
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

  const handleSubmitUpdate = (e) => {
    e.preventDefault();
    const toastUpdate = toast.loading('Đang cập nhật');
    const term = {
      termName: updateFrom.current.termName.value.trim(),
      credit: updateFrom.current.credit.value.trim(),
    };
    axiosClient
      .put(`admin/terms/${selectedTerm.id}`, term)
      .then((response) => {
        console.log(response);
        getTerms();
        setSelectedTerm(null);
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

  const handleDeleteTerm = (term) => {
    if (!window.confirm(`Xác nhận xóa học phần ${term.termName} (${term.id})`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/terms/${term.id}`, term)
      .then((response) => {
        console.log(response);
        getTerms();
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
                  <CTableHeaderCell scope="col">Mã học phần</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên học phần</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Số tín chỉ</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {terms.map((term, index) => (
                  <CTableRow key={term.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{term.id}</CTableDataCell>
                    <CTableDataCell>{term.termName}</CTableDataCell>
                    <CTableDataCell>{term.credit}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" onClick={() => setSelectedTerm(term)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" onClick={() => handleDeleteTerm(term)}>
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
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputTermName" className="col-sm-3 col-form-label">
                Tên học phần
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="text" id="inputTermName" name="termName" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputName" className="col-sm-3 col-form-label">
                Số tín chỉ
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="number" id="inputName" name="credit" />
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
      {selectedTerm && (
        <CModal backdrop={'static'} visible={true} onClose={() => setSelectedTerm(null)}>
          <CModalHeader>
            <CModalTitle>Cập nhật thông tin học phần</CModalTitle>
          </CModalHeader>
          <CForm ref={updateFrom} onSubmit={handleSubmitUpdate} method="POST ">
            <CModalBody>
              <CRow className="mb-3">
                <CFormLabel htmlFor="inputTermName" className="col-sm-3 col-form-label">
                  Tên học phần
                </CFormLabel>
                <CCol sm={9}>
                  <CFormInput
                    type="text"
                    id="inputTermName"
                    name="termName"
                    defaultValue={selectedTerm.termName}
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
                    defaultValue={selectedTerm.credit}
                  />
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton color="secondary" onClick={() => setSelectedTerm(null)}>
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

export default Term;
