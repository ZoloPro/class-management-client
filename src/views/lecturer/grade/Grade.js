import React, { useEffect, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
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
  CSpinner,
  CCol,
  CButton,
  CRow,
} from '@coreui/react';
import { toast } from 'react-toastify';

const Grade = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [classroomLoading, setClassroomLoading] = useState(true);

  let classroomId = useParams().classroomId;

  useEffect(() => {
    if (classroomId) {
      getGrades();
    } else {
      console.log('no classroom id');
      setGrades([]);
      setLoading(false);
    }
    getClassrooms();
  }, [classroomId]);

  const getClassrooms = () => {
    axiosClient
      .get('/lecturer/classrooms')
      .then((response) => {
        const classrooms = response?.data?.data?.classrooms;
        setClassroom(classrooms.find((classroom) => classroom.id == classroomId));
        setClassrooms(classrooms);
        setClassroomLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGrades = () => {
    setLoading(true);
    axiosClient
      .get(`/lecturer/grades/${classroomId}`)
      .then((response) => {
        console.log(response);
        setGrades(response?.data?.data?.gradeList);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validationSchema = Yup.object().shape({
    grade: Yup.number('Điểm không hợp lệ')
      .nullable()
      .min(0, 'Điểm không hợp lệ')
      .max(10, 'Điểm không hợp lệ'),
  });

  const handleCellChange = (event, id, field) => {
    const newGrades = grades.map((grade) => {
      if (grade.id == id) {
        return {
          ...grade,
          grade: { ...grade.grade, [field]: event.target.value },
        };
      }
      return grade;
    });
    setGrades(newGrades);
    setIsSaved(false);
  };

  const validateCell = (event, id, field) => {
    validationSchema
      .validate({ grade: event.target.value === '' ? null : event.target.value })
      .then((response) => {
        console.log(response);
        handleCellChange(event, id, field);
        event.target.style.color = '';
      })
      .catch((error) => {
        console.log(error);
        event.target.style.color = 'red';
      });
  };

  const handleSave = () => {
    const saveToast = toast.loading('Đang lưu');
    console.log(grades);
    axiosClient
      .put(`/lecturer/grades/${classroomId}`, {
        grades: grades.map((grade) => {
          return {
            studentId: grade.id,
            attendanceGrade: grade.grade.attendanceGrade,
            examGrade: grade.grade.examGrade,
          };
        }),
      })
      .then((response) => {
        console.log(response);
        setIsSaved(true);
        toast.update(saveToast, {
          render: 'Lưu thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        getGrades();
      })
      .catch((error) => {
        console.log(error);
        toast.update(saveToast, {
          render: error?.response?.data?.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  return (
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
                  <CDropdownItem key={classroom.id} href={`#/grade/${classroom.id}`}>
                    {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                  </CDropdownItem>
                ))
              )}
            </CDropdownMenu>
          </CDropdown>
          {classroom && <span>{`Lớp: ${classroom.term.termName} (mã lớp ${classroomId})`}</span>}
        </CCol>
        {classroomId && (
          <CCol className="d-flex justify-content-end gap-4">
            <p className="my-auto">
              Trạng thái:{' '}
              <span className={isSaved ? 'text-success' : 'text-danger'}>
                {isSaved ? 'Đã lưu' : 'Chưa lưu'}
              </span>
            </p>
            <CButton color="success" onClick={handleSave}>
              Lưu
            </CButton>
          </CCol>
        )}
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
                <CTableHeaderCell scope="col" width={'20%'}>
                  Họ và lót
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width={'20%'}>
                  Tên
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width={'15%'}>
                  Điểm chuyên cần
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width={'15%'}>
                  Điểm kiểm tra
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width={'15%'}>
                  Điểm quá trình
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {grades?.map((grade, index) => (
                <CTableRow key={grade.id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{grade.code}</CTableDataCell>
                  <CTableDataCell>{grade.famMidName}</CTableDataCell>
                  <CTableDataCell>{grade.name}</CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.attendanceGrade != null ? grade.grade.attendanceGrade : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) => validateCell(event, grade.id, 'attendanceGrade')}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={grade.grade.examGrade != null ? grade.grade.examGrade : ''}
                      className={'editable-cell text-center'}
                      onChange={(event) => validateCell(event, grade.id, 'examGrade', index)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    {grade.grade.finalGrade != null ? grade.grade.finalGrade : ''}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </div>
    </CCard>
  );
};

export default Grade;
