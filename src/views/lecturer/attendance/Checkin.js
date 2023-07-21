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

const Checkin = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [checkinVisible, setCheckinVisible] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [checkinURL, setCheckinURL] = useState(null);
  const [loading, setLoading] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [countdownIntervalId, setCountdownIntervalId] = useState(null);
  const [countdown, setCountdown] = useState(10);

  const classroomId = useParams().classroomId;

  useEffect(() => {
    getClassrooms();
  }, [classroomId]);

  const getClassrooms = () => {
    axiosClient
      .get('/lecturer/classrooms')
      .then((response) => {
        console.log(response);
        setClassrooms(response?.data?.data?.classrooms);
        // Update the countdown timer every second
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCheckinUrl = () => {
    axiosClient
      .get(`/lecturer/attendance/${classroomId}`)
      .then((response) => {
        console.log(response);
        setCheckinURL(response?.data?.data?.url);
        setCountdown(10);
        setCountdownIntervalId(
          setInterval(() => {
            setCountdown((prevCountdown) => Math.max(prevCountdown - 1, 0));
          }, 1000),
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleShowCheckinQR = () => {
    setCheckinVisible(true);
    fetchCheckinUrl();
    setIntervalId(
      setInterval(() => {
        fetchCheckinUrl();
        clearInterval(countdownIntervalId);
      }, 10000),
    );
  };

  const handleCloseCheckinQR = () => {
    setCheckinVisible(false);
    clearInterval(intervalId);
    clearInterval(countdownIntervalId);
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
                  <CDropdownItem key={classroom.id} href={`#/attendance/${classroom.id}`}>
                    {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                  </CDropdownItem>
                ))}
              </CDropdownMenu>
            </CDropdown>
            {classroom && <span>{`Lớp: ${classroom.term.termName} (mã lớp ${classroomId})`}</span>}
          </CCol>
          <CCol className="d-flex justify-content-end gap-3">
            <button type="button" className="btn btn-success" onClick={handleShowCheckinQR}>
              Hiện QR điểm danh
            </button>
          </CCol>
        </CRow>
      </CCard>
      <CModal visible={checkinVisible} onClose={handleCloseCheckinQR}>
        <CModalHeader>
          <CModalTitle>Quét để điểm danh</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            {checkinURL && (
              <QRCodeSVG
                value={checkinURL}
                size={450}
                imageSettings={{
                  src: oig,
                  height: 116,
                  width: 116,
                  excavate: true,
                }}
              />
            )}
          </CRow>
          <CRow>
            <CProgress value={countdown * 10}>{`${countdown}s`}</CProgress>
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
