import React, { useEffect, useRef, useState } from 'react';
import { cilDataTransferDown, cilTrash } from '@coreui/icons';
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { useParams } from 'react-router-dom';

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);

  const addFrom = useRef();

  const classroomId = useParams().classroomId;

  useEffect(() => {
    getDocuments();
    getClassrooms();
  }, [classroomId]);
  const getDocuments = () => {
    if (!classroomId) {
      setDocuments([]);
      return;
    }
    axiosClient
      .get(`/lecturer/documents/${classroomId}`)
      .then((response) => {
        console.log(response);
        setClassroom(response?.data?.data?.classroom);
        setDocuments(response?.data?.data?.documents);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClassrooms = () => {
    axiosClient
      .get('/lecturer/classrooms')
      .then((response) => {
        console.log(response);
        setClassrooms(response?.data?.data?.classrooms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteDocument = (document) => {
    if (!window.confirm(`Xác nhận xóa tài liệu ${document.fileName}`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`lecturer/documents/${document.id}`, document)
      .then((response) => {
        console.log(response);
        getDocuments();
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

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    const toastImport = toast.loading('Đang tải file lên');
    const file = addFrom.current.file.files[0];
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    axiosClient
      .post(`/lecturer/documents/${classroomId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        getDocuments();
        setAddFormVisible(false);
        toast.update(toastImport, {
          render: 'Tải file lên thành công',
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
        <CRow className="p-2">
          <CCol className="d-flex gap-3 align-items-center">
            <CDropdown>
              <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
              <CDropdownMenu>
                {classrooms?.map((classroom) => (
                  <CDropdownItem
                    key={classroom.id}
                    href={`#/document/${classroom.id}`}
                    onClick={() => setLoading(true)}
                  >
                    {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            {classroom && <span>{`Lớp: ${classroom.term.termName} (mã lớp ${classroomId})`}</span>}
          </CCol>
          <CCol className="d-flex justify-content-end gap-3">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setAddFormVisible(!addFormVisible)}
            >
              Thêm
            </button>
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
                  <CTableHeaderCell scope="col">Mã tài liệu</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên tài liệu</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {documents.map((document, index) => (
                  <CTableRow key={document.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{document.id}</CTableDataCell>
                    <CTableDataCell>{document.fileName}</CTableDataCell>
                    <CTableDataCell>
                      <a href={document.url} target="_blank" rel="noopener noreferrer">
                        <CButton color="primary">
                          <CIcon icon={cilDataTransferDown} />
                        </CButton>
                      </a>
                      <CButton color="danger" onClick={() => handleDeleteDocument(document)}>
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
          <CModalTitle>Thêm tài liệu</CModalTitle>
        </CModalHeader>
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputFile" className="col-sm-3 col-form-label">
                Chọn file
              </CFormLabel>
              <CCol sm={9}>
                <CFormInput type="file" id="inputFile" name="file" accept=".pdf" required />
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
    </div>
  );
};

export default Document;
