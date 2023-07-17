import React, { useEffect, useState } from 'react';
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

const Attendance = () => {
  const [data, setData] = useState([
    { code: 1, famMidName: 'John', name: 'fdfd', mark: 23 },
    { code: 2, famMidName: 'John', name: 'fdfd', mark: 23 },
    { code: 3, famMidName: 'John', name: 'fdfd', mark: 23 },
    { code: 4, famMidName: 'John', name: 'fdfd', mark: 23 },
    // ...more data
  ]);

  const handleCellChange = (event, code, field) => {
    const newData = data.map((item) => {
      if (item.code === code) {
        return {
          ...item,
          [field]: event.target.value,
        };
      }
      return item;
    });
    setData(newData);
  };
  /*const [students, setStudents] = useState([])

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('API_URL'); // Thay thế 'API_URL' bằng URL thực tế của API
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };*/

  return (
    <CCard>
      <div className={'m-2'}>
        <CDropdown>
          <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem href="#">Action</CDropdownItem>
            <CDropdownItem href="#">Another action</CDropdownItem>
            <CDropdownItem href="#">Something else here</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <button type="button" className="btn btn-success">
          Success
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
            {data.map((item, index) => (
              <CTableRow key={item.code}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{item.code}</CTableDataCell>
                <CTableDataCell>{item.famMidName}</CTableDataCell>
                <CTableDataCell>{item.name}</CTableDataCell>
                <CTableDataCell>
                  <input
                    type="text"
                    defaultValue={item.mark}
                    className={'editable-cell'}
                    onInput={(event) => handleCellChange(event, item.code, 'mark')}
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

export default Attendance;
