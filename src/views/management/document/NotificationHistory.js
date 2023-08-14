import React, { useEffect, useState } from 'react';
import { cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CButton,
  CSpinner,
} from '@coreui/react';

const NotificationHistory = () => {
  const [notificationHistories, setNotificationHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotificationHistories();
  }, []);

  const getNotificationHistories = () => {
    axiosClient
      .get(`/admin/notifications`)
      .then((response) => {
        console.log(response);
        setNotificationHistories(response?.data?.data?.notifications);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*const handleDeleteNotificationHistory = (notificationHistory) => {
    if (
      !window.confirm(
        `Xác nhận xóa khoa ${notificationHistory.notificationHistoryName} (${notificationHistory.id})`,
      )
    ) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/notificationHistorys/${notificationHistory.id}`, notificationHistory)
      .then((response) => {
        console.log(response);
        getNotificationHistorys();
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
  };*/

  return (
    <div>
      <CCard>
        <div className={'m-2'}>
          {loading ? (
            <CSpinner />
          ) : (
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Mã thông báo</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tiêu đề</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tiêu đề phụ</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Người nhận</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thời gian</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {notificationHistories.map((notificationHistory, index) => {
                  let receiver = '';
                  switch (notificationHistory.type) {
                    case 1:
                      receiver = 'Toàn trường';
                      break;
                    case 2:
                      receiver = 'Toàn sinh viên trường';
                      break;
                    case 3:
                      receiver = 'Toàn giảng viên trường';
                      break;
                    case 4:
                      receiver = 'Toàn sinh viên theo khoa';
                      break;
                    case 5:
                      receiver = 'Toàn sinh viên theo lớp';
                      break;
                  }
                  return (
                    <CTableRow key={notificationHistory.id}>
                      <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                      <CTableDataCell>{notificationHistory.id}</CTableDataCell>
                      <CTableDataCell>{notificationHistory.title}</CTableDataCell>
                      <CTableDataCell>{notificationHistory.subtitle}</CTableDataCell>
                      <CTableDataCell>{receiver}</CTableDataCell>
                      <CTableDataCell>{notificationHistory.time}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          href={`#/admin/notification-history/${notificationHistory.id}`}
                        >
                          Chi tiết
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          )}
        </div>
      </CCard>
    </div>
  );
};

export default NotificationHistory;
