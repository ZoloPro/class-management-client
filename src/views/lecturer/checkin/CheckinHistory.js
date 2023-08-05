import React, { useEffect, useRef, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import { useParams, useSearchParams } from 'react-router-dom';
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
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/react';
import { Field, Form, Formik } from 'formik';

const CheckinHistory = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [fromDate, setFromDate] = useState(searchParams.get('from'));
  const [toDate, setToDate] = useState(searchParams.get('to'));
  const [classroomLoading, setClassroomLoading] = useState(true);

  let classroomId = useParams().classroomId;

  useEffect(() => {
    if (classroomId) {
      // Lấy giá trị "to" từ query string, nếu không có thì gán là ngày hiện tại
      const to = searchParams.get('to') ? new Date(searchParams.get('to')) : new Date();
      const toStr = to.toISOString().split('T')[0];
      setToDate(toStr);

      // Lấy giá trị "from" từ query string, nếu không có thì gán là 7 ngày trước "to"
      const from = searchParams.get('from')
        ? new Date(searchParams.get('from'))
        : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fromStr = from.toISOString().split('T')[0];
      setFromDate(fromStr);
    }
  }, [classroomId]);

  useEffect(() => {
    if (classroomId) {
      fromDate && toDate && getCheckinHistory();
    } else {
      setCheckinHistory([]);
      setLoading(false);
    }
    getClassrooms();
  }, [classroomId, fromDate, toDate]);

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

  const getCheckinHistory = () => {
    setLoading(true);
    axiosClient
      .get(`/lecturer/checkin/${classroomId}/history?from=${fromDate}&to=${toDate}`)
      .then((response) => {
        console.log(response);
        setCheckinHistory(response?.data?.data?.checkinHistory);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFilter = (values) => {
    const { from, to } = values;
    setFromDate(from);
    setToDate(to);
    setSearchParams({ from, to });
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
                  <CDropdownItem key={classroom.id} href={`#/checkin-history/${classroom.id}`}>
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
            <Formik
              initialValues={{
                from: fromDate,
                to: toDate,
              }}
              onSubmit={handleFilter}
            >
              {() => (
                <Form as={CForm} className="row row-cols-lg-auto g-3 align-items-center">
                  <CCol xs={12}>
                    <CInputGroup>
                      <CInputGroupText>Từ</CInputGroupText>
                      <Field as={CFormInput} type="date" name="from" />
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12}>
                    <CInputGroup>
                      <CInputGroupText>Đến</CInputGroupText>
                      <Field as={CFormInput} type="date" name="to" />
                    </CInputGroup>
                  </CCol>
                  <CCol xs={12}>
                    <CButton type="submit">Lọc</CButton>
                  </CCol>
                </Form>
              )}
            </Formik>
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
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mã sinh viên</CTableHeaderCell>
                <CTableHeaderCell scope="col">Họ và lót</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
                {checkinHistory?.dates?.map((date) => {
                  const viewDate = new Date(date.date);
                  return (
                    <CTableHeaderCell scope="col" key={date}>
                      {`${viewDate.getDate()}/${viewDate.getMonth() + 1} ${
                        date.time == 0 ? 'Sáng' : 'Chiều'
                      }`}
                    </CTableHeaderCell>
                  );
                })}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {checkinHistory?.checkedInList?.map((student, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{student.code}</CTableDataCell>
                  <CTableDataCell>{student.famMidName}</CTableDataCell>
                  <CTableDataCell>{student.name}</CTableDataCell>
                  {student?.checkedIn?.map((item, index) => {
                    let isChecked = '';
                    if (item.checked) {
                      let checkinTime = new Date(item.checked.created_at);
                      let type;
                      if (item.checked.type == 1) {
                        type = 'Đầu';
                      } else if (item.checked.type == 2) {
                        type = 'Giữa';
                      } else {
                        type = 'Cuối';
                      }
                      isChecked = `${type} - ${checkinTime.getHours()}:${checkinTime.getMinutes()}:${checkinTime.getSeconds()}`;
                    }
                    return (
                      <CTableDataCell key={index} style={{ minWidth: '100px' }}>
                        {isChecked}
                      </CTableDataCell>
                    );
                  })}
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </div>
    </CCard>
  );
};

export default CheckinHistory;
