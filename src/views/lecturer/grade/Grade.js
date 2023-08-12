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

  const handleExport = () => {
    const exportToast = toast.loading('Đang xuất báo cáo');
    axiosClient
      .get(`lecturer/grades/${classroomId}/report`, { responseType: 'blob' })
      .then((response) => {
        toast.dismiss(exportToast);
        window.open(URL.createObjectURL(response.data));
      })
      .catch((error) => {
        console.log(error);
        toast.update(exportToast, {
          render: error?.response?.data?.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const sendNotify = () => {
    axiosClient
      .post(`lecturer/send-notification/${classroomId}`, {
        title: classroom?.term?.termName,
        body: 'Đã có điểm thi, vui lòng xem ngay',
        type: 2,
      })
      .then((response) => {
        toast.success('Đã gửi thông báo đến toàn bộ lớp học');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSave = () => {
    const saveToast = toast.loading('Đang lưu');
    console.log(grades);
    for (let key in grades) {
      delete grades[key].grade.final;
    }
    axiosClient
      .put(`/lecturer/grades/${classroomId}`, { gradeList: grades })
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
        sendNotify();
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
            <CButton onClick={handleExport}>Xuất file tổng kết</CButton>
          </CCol>
        )}
      </CRow>
      <div className={'m-2'}>
        {loading ? (
          <CSpinner />
        ) : (
          <CTable responsive bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col" rowSpan={2} width="30px">
                  #
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="30px">
                  Mã sinh viên
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="150px">
                  Họ và lót
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="100px">
                  Tên
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="50px">
                  Điểm chuyên cần
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" colSpan={3} className="text-center">
                  Điểm hệ số 1
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" colSpan={2} className="text-center">
                  Điểm hệ số 2
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="50px">
                  Điểm thi
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" rowSpan={2} width="50px">
                  Điểm trung bình
                </CTableHeaderCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell scope="col" width="50px">
                  Điểm 1
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width="50px">
                  Điểm 2
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width="50px">
                  Điểm 3
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width="50px">
                  Điểm 1
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width="50px">
                  Điểm 2
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
                      defaultValue={grade.grade.attendance != null ? grade.grade.attendance : ''}
                      className={'editable-cell text-center'}
                      onChange={(event) => validateCell(event, grade.id, 'attendance')}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.coefficient1Exam1 != null ? grade.grade.coefficient1Exam1 : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) =>
                        validateCell(event, grade.id, 'coefficient1Exam1', index)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.coefficient1Exam2 != null ? grade.grade.coefficient1Exam2 : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) =>
                        validateCell(event, grade.id, 'coefficient1Exam2', index)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.coefficient1Exam3 != null ? grade.grade.coefficient1Exam3 : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) =>
                        validateCell(event, grade.id, 'coefficient1Exam3', index)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.coefficient2Exam1 != null ? grade.grade.coefficient2Exam1 : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) =>
                        validateCell(event, grade.id, 'coefficient2Exam1', index)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={
                        grade.grade.coefficient2Exam2 != null ? grade.grade.coefficient2Exam2 : ''
                      }
                      className={'editable-cell text-center'}
                      onChange={(event) =>
                        validateCell(event, grade.id, 'coefficient2Exam2', index)
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <input
                      type="text"
                      defaultValue={grade.grade.exam != null ? grade.grade.exam : ''}
                      className={'editable-cell text-center'}
                      onChange={(event) => validateCell(event, grade.id, 'exam', index)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    {grade.grade.final != null ? grade.grade.final : ''}
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
