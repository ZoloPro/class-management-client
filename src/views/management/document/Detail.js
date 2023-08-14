import React, { useEffect, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import { CCard } from '@coreui/react';
import { useParams } from 'react-router-dom';

const NotificationHistory = () => {
  const [notification, setNotification] = useState(null);
  const notificationId = useParams().notificationId;

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = () => {
    axiosClient
      .get(`/admin/notifications/${notificationId}`)
      .then((response) => {
        console.log(response);
        setNotification(response?.data?.data?.notification);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <CCard>
      <div dangerouslySetInnerHTML={{ __html: notification?.content }}></div>
    </CCard>
  );
};

export default NotificationHistory;
