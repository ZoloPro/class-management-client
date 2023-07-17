import React, { useEffect, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import { useParams } from 'react-router-dom';
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
} from '@coreui/react';

const Mark = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [marks, setMarks] = useState([]);

  useEffect(() => {
    getClass();
  });

  const classroomId = useParams().classroomId;

  const getClass = () => {
    axiosClient
      .get('/lecturer/classrooms')
      .then((response) => {
        setClassrooms(response.data.classrooms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getMarks = () => {
    axiosClient
      .get(`/lecturer/classrooms/${classroomId}/mark`)
      .then((response) => {
        console.log(response);
        setMarks(response?.data.markList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (classroomId) {
    getMarks();
  }

  const handleCellChange = (event, code, field) => {
    const newMarks = marks.map((mark) => {
      if (mark.code === code) {
        return {
          ...mark,
          [field]: event.target.value,
        };
      }
      return mark;
    });
    setMarks(newMarks);
  };

  return (
    <CCard>
      <div className={'d-flex justify-content-between m-2'}>
        <CDropdown>
          <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
          <CDropdownMenu>
            {classrooms?.map((classroom) => (
              <CDropdownItem key={classroom.id} href="">
                {`${classroom.termName} (mã lớp: ${classroom.id})`}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
        <button type="button" className="btn btn-success">
          Lưu
        </button>
      </div>
      <div className={'m-2'}>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col" width={'10%'}>
                #
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" width={'20%'}>
                Mã sinh viên
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" width={'30%'}>
                Họ và lót
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" width={'30%'}>
                Tên
              </CTableHeaderCell>
              <CTableHeaderCell scope="col" width={'10%'}>
                Điểm
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {marks?.map((mark, index) => (
              <CTableRow key={mark.code}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{mark.code}</CTableDataCell>
                <CTableDataCell>{mark.famMidName}</CTableDataCell>
                <CTableDataCell>{mark.name}</CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    defaultValue={mark.mark ? mark.mark : ''}
                    className={'editable-cell'}
                    onInput={(event) => handleCellChange(event, mark.code, 'mark')}
                  />
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </CCard>
  );
};

export default Mark;
