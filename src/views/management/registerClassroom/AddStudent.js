import React, { useEffect, useRef, useState } from 'react';
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
  CFormCheck,
  CSpinner,
  CRow,
  CCol,
  CFormSelect,
} from '@coreui/react';
import { useNavigate, useParams } from 'react-router-dom';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState([]);
  const [studentsOfClass, setStudentsOfClass] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [departments, setDepartments] = useState([]);

  const lastChecked = useRef(null);
  const tableRowRef = useRef([]);

  const classroomId = useParams().classroomId;

  const navigate = useNavigate();

  useEffect(() => {
    getStudents();
    getStudentsOfClass();
    getDepartments();
  }, []);

  const getDepartments = () => {
    axiosClient
      .get(`/admin/departments`)
      .then((response) => {
        console.log(response);
        setDepartments(response?.data?.data?.departments);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getStudentsOfClass = () => {
    axiosClient
      .get(`/admin/classrooms/${classroomId}`)
      .then((response) => {
        console.log(response);
        setClassroom(response?.data?.data?.classroom);
        const students = response?.data?.data?.classroom.students;
        setStudentsOfClass(students.map((student) => student.id.toString()));
        setLoading(false);
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

  const handleSave = () => {
    const saveToast = toast.loading('Đang lưu');
    axiosClient
      .put(`/admin/classrooms/${classroomId}/student`, { students: checked })
      .then((response) => {
        toast.update(saveToast, {
          render: 'Lưu thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        navigate(`/admin/register-classroom/${classroomId}`);
      })
      .catch((error) => {
        toast.update(saveToast, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
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

  const onCheck = (e) => {
    const index = e.target.id;
    const isChecked = e.target.checked;
    if (lastChecked.current != null && e.nativeEvent.shiftKey) {
      const start = Math.min(lastChecked.current, index);
      const end = Math.max(lastChecked.current, index);
      setChecked((prev) => {
        let newChecked = [...prev];
        for (let i = start; i <= end; i++) {
          const studentIdRef = tableRowRef.current[i].value;
          if (isChecked) {
            if (!newChecked.includes(studentIdRef)) {
              newChecked.push(studentIdRef);
            }
          } else {
            newChecked = newChecked.filter((item) => item != studentIdRef);
          }
        }
        return newChecked;
      });
    } else {
      setChecked((prev) => {
        if (isChecked) {
          return [...prev, e.target.value];
        } else {
          return prev.filter((i) => i !== e.target.value);
        }
      });
    }
    lastChecked.current = index;
    console.log(checked);
  };
  return (
    <div>
      <CCard>
        <CRow className={'m-2'}>
          <CCol>
            <CRow>
              <CCol>
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
              <CCol>
                <span>{`${classroom?.term?.termName ?? ''} (mã lớp ${classroomId})`}</span>
              </CCol>
            </CRow>
          </CCol>
          <CCol className="text-end">
            <CButton color="success" onClick={handleSave}>
              Lưu
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {students.map((student, index) => (
                  <CTableRow key={student.id}>
                    <CTableHeaderCell>
                      <CFormCheck
                        id={index.toString()}
                        checked={
                          studentsOfClass.includes(student.id.toString()) ||
                          checked.includes(student.id.toString())
                        }
                        disabled={studentsOfClass.includes(student.id.toString())}
                        onChange={(e) => onCheck(e, student)}
                        ref={(el) => (tableRowRef.current[index] = el)}
                        value={student.id}
                      ></CFormCheck>
                    </CTableHeaderCell>
                    <CTableDataCell>{student.code}</CTableDataCell>
                    <CTableDataCell>{student.famMidName}</CTableDataCell>
                    <CTableDataCell>{student.name}</CTableDataCell>
                    <CTableDataCell>{student.gender}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(student.birthdate).toLocaleDateString()}
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
export default Student;
