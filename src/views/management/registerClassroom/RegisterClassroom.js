import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CDropdown,
  CModalHeader,
  CModalTitle,
  CForm,
  CModalBody,
  CRow,
  CFormLabel,
  CCol,
  CModalFooter,
  CButton,
  CModal,
  CSpinner,
} from '@coreui/react';
import { toast } from 'react-toastify';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';

const RegisterClassroom = () => {
  const [classrooms, setClassrooms] = useState([]); //Lầy toàn bộ danh sách lớp họ để đổ vào Menu
  const [classroom, setClassroom] = useState(null); //Thông tin lớp học hiện tại
  const [studentList, setStudentList] = useState([]); //Toàn bộ danh sách sinh viên theo mã lớp
  const [loading, setLoading] = useState(true);
  const [classroomLoading, setClassroomLoading] = useState(true);

  const classroomId = useParams().classroomId;

  const navigate = useNavigate();

  useEffect(() => {
    if (classroomId) {
      getStudentList(); //Lấy toàn bộ danh sách sinh viên theo mã lớp
    } else {
      setLoading(false);
    }
    getClassrooms();
  }, [classroomId]);

  const getClassrooms = () => {
    setLoading(true);
    axiosClient
      .get('/admin/classrooms')
      .then((response) => {
        setClassrooms(response?.data?.data?.classrooms);
        setClassroomLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStudentList = () => {
    axiosClient
      .get(`/admin/classrooms/${classroomId}`)
      .then((response) => {
        console.log(response);
        setClassroom(response?.data?.data?.classroom);
        const students = response?.data?.data?.classroom.students;
        students.forEach((student) => {
          student.status = 'Đã lưu';
        });
        setStudentList(response?.data?.data?.classroom.students);
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
          <CCol className="d-flex gap-3 align-items-center">
            <CDropdown>
              <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
              <CDropdownMenu>
                {classroomLoading ? (
                  <CSpinner />
                ) : (
                  classrooms?.map((classroom) => (
                    <CDropdownItem
                      key={classroom.id}
                      href={`#/admin/register-classroom/${classroom.id}`}
                    >
                      {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                    </CDropdownItem>
                  ))
                )}
              </CDropdownMenu>
            </CDropdown>
            {classroom && <span>{`Lớp: ${classroom.term.termName} (mã lớp ${classroomId})`}</span>}
          </CCol>
          <CCol className="text-end ">
            <CButton
              color="primary"
              onClick={() => {
                navigate(`/admin/register-classroom/${classroomId}/add`);
              }}
            >
              Chỉnh sửa
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
                  <CTableHeaderCell scope="col" width={'10%'}>
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'20%'}>
                    Mã sinh viên
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'20%'}>
                    Họ và lót
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'20%'}>
                    Tên
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Giới tính
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Trạng thái
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" width={'10%'}>
                    Thao tác
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {studentList.map((student, index) => (
                  <CTableRow key={student.code}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{student.code}</CTableDataCell>
                    <CTableDataCell>{student.famMidName}</CTableDataCell>
                    <CTableDataCell>{student.name}</CTableDataCell>
                    <CTableDataCell>{student.gender}</CTableDataCell>
                    <CTableDataCell
                      className={student.status == 'Đã lưu' ? 'text-success' : 'text-danger'}
                    >
                      {student.status}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger">
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
    </div>
  );
};

export default RegisterClassroom;
