import React, { useEffect, useState } from 'react';
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
} from '@coreui/react';
import { toast } from 'react-toastify';

const CheckinHistory = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [classroomLoading, setClassroomLoading] = useState(true);

  const currentDate = new Date();
  const formattedCurrentDate = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(currentDate.getDate() - 7);
  const formattedSevenDaysAgo = `${sevenDaysAgo.getFullYear()}-${
    sevenDaysAgo.getMonth() + 1
  }-${sevenDaysAgo.getDate()}`;

  console.log(formattedCurrentDate, formattedSevenDaysAgo);

  let classroomId = useParams().classroomId;

  useEffect(() => {
    if (classroomId) {
      setFromDate(searchParams.get('from') ?? formattedSevenDaysAgo);
      setToDate(searchParams.get('to') ?? formattedCurrentDate);
      getCheckinHistory();
    } else {
      console.log('no classroom id');
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
            <CButton color="success">Lọc</CButton>
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
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Mã sinh viên</CTableHeaderCell>
                <CTableHeaderCell scope="col">Họ và lót</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên</CTableHeaderCell>
                {checkinHistory?.dates?.map((date) => {
                  const viewDate = new Date(date);
                  return (
                    <CTableHeaderCell scope="col" key={date}>
                      {`${viewDate.getDate()}/${viewDate.getMonth() + 1}`}
                    </CTableHeaderCell>
                  );
                })}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {checkinHistory?.checkedInList?.map((checkin, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{checkin.code}</CTableDataCell>
                  <CTableDataCell>{checkin.famMidName}</CTableDataCell>
                  <CTableDataCell>{checkin.name}</CTableDataCell>
                  {checkin?.checkedIn?.map((item, index) => (
                    <CTableDataCell key={index}>{item.isChecked ? 'v' : 'x'}</CTableDataCell>
                  ))}
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
