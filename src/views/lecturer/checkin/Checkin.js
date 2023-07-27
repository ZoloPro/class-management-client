import React, { useEffect, useState } from 'react';
import axiosClient from '../../../axios/axios-client';
import {
  CCard,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CProgress,
} from '@coreui/react';
import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import oig from 'src/assets/images/OIG.png';
import { toast } from 'react-toastify';

const Checkin = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [checkinVisible, setCheckinVisible] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [checkinToken, setCheckinToken] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const classroomId = useParams().classroomId;

  useEffect(() => {
    getClassrooms();
  }, [classroomId]);

  useEffect(() => {
    let timer;

    if (checkinVisible) {
      // Start the countdown only if the showButton is true
      if (countdown === 0) {
        fetchCheckinToken();
      }

      if (countdown > 0) {
        timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
      }
    }

    return () => clearInterval(timer); // Clean up the timer on component unmount or showButton is false
  }, [countdown, checkinVisible]);

  const getClassrooms = () => {
    axiosClient
      .get('/lecturer/classrooms')
      .then((response) => {
        console.log(response);
        const classrooms = response?.data?.data?.classrooms;
        setClassroom(classrooms.find((classroom) => classroom.id == classroomId));
        setClassrooms(classrooms);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCheckinToken = () => {
    axiosClient
      .get(`/lecturer/checkin/${classroomId}`)
      .then((response) => {
        console.log(response);
        setCheckinToken(response?.data?.data?.token);
        setCountdown(10); // Reset countdown to 10 seconds on successful API response
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowCheckinQR = () => {
    const logToast = toast.loading('Đang tạo mã điểm danh');
    axiosClient
      .post(`/lecturer/checkin/${classroomId}`)
      .then((response) => {
        console.log(response);
        setCheckinVisible(true);
        toast.dismiss(logToast);
      })
      .catch((error) => {
        console.log(error);
        toast.update(logToast, {
          render: 'Tạo mã điểm danh thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleCloseCheckinQR = () => {
    setCheckinVisible(false);
    setCheckinToken(null);
    setCountdown(0);
  };

  return (
    <div>
      <CCard>
        <CRow className="p-2">
          <CCol className="d-flex gap-3 align-items-center">
            <CDropdown>
              <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
              <CDropdownMenu>
                {classrooms?.map((classroom) => (
                  <CDropdownItem key={classroom.id} href={`#/checkin/${classroom.id}`}>
                    {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            {classroom && <span>{`Lớp: ${classroom.term.termName} (mã lớp ${classroomId})`}</span>}
          </CCol>
          {classroom && (
            <CCol className="d-flex justify-content-end gap-3">
              <button type="button" className="btn btn-success" onClick={handleShowCheckinQR}>
                Hiện QR điểm danh
              </button>
            </CCol>
          )}
        </CRow>
      </CCard>
      <CModal visible={checkinVisible} onClose={handleCloseCheckinQR}>
        <CModalHeader>
          <CModalTitle>Quét để điểm danh</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            {checkinToken && (
              <QRCodeSVG
                value={checkinToken}
                size={400}
                imageSettings={{
                  src: oig,
                  height: 70,
                  width: 70,
                  excavate: true,
                }}
              />
            )}
          </CRow>
          <CRow className="my-2">
            <CProgress value={countdown * 10}> {countdown}s </CProgress>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseCheckinQR}>
            Đóng
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Checkin;
