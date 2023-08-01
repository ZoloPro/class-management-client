import React, { useEffect, useState } from 'react';
import { cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axiosClient from '../../../axios/axios-client';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CCard,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CCol,
  CFormLabel,
  CForm,
  CFormInput,
  CSpinner,
} from '@coreui/react';

const WifiInfo = () => {
  const [wifiInfo, setWifiInfo] = useState([]);
  const [addFormVisible, setAddFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWifiInfo();
  }, []);

  const validationSchema = Yup.object().shape({
    wifiName: Yup.string().required('Vui lòng nhập tên wifi'),
    wifiBSSID: Yup.string().required('Vui lòng nhập BSSID'),
  });

  const getWifiInfo = () => {
    axiosClient
      .get(`/admin/wifi-info`)
      .then((response) => {
        console.log(response);
        setWifiInfo(response?.data?.data?.wifiInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmitAdd = (values) => {
    const toastAdd = toast.loading('Đang thêm');
    axiosClient
      .post('admin/wifi-info', values)
      .then((response) => {
        console.log(response);
        getWifiInfo();
        setAddFormVisible(false);
        toast.update(toastAdd, {
          render: 'Thêm thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.update(toastAdd, {
          render: error.response.data.message || 'Đã xảy ra lỗi',
          type: 'error',
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  const handleDeleteWifiInfo = (wifiInfo) => {
    if (!window.confirm(`Xác nhận xóa mạng wifi ${wifiInfo.wifiName}`)) {
      return;
    }
    const toastDelete = toast.loading('Đang xóa');
    axiosClient
      .delete(`admin/wifi-info/${wifiInfo.id}`, wifiInfo)
      .then((response) => {
        console.log(response);
        getWifiInfo();
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
  };

  return (
    <div>
      <CCard>
        <div className={'m-2 d-flex gap-4 justify-content-end'}>
          <CButton color="success" onClick={() => setAddFormVisible(!addFormVisible)}>
            <CIcon icon={cilPlus} /> Thêm
          </CButton>
        </div>
        <div className={'m-2'}>
          {loading ? (
            <CSpinner />
          ) : (
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Tên Wifi</CTableHeaderCell>
                  <CTableHeaderCell scope="col">BSSID Wifi</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Thao tác</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {wifiInfo.map((item, index) => (
                  <CTableRow key={item.id}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{item.id}</CTableDataCell>
                    <CTableDataCell>{item.wifiName}</CTableDataCell>
                    <CTableDataCell>{item.wifiBSSID}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="danger" onClick={() => handleDeleteWifiInfo(item)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </div>
      </CCard>
      <CModal visible={addFormVisible} onClose={() => setAddFormVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm thông tin Wifi</CModalTitle>
        </CModalHeader>
        <Formik
          initialValues={{
            wifiName: '',
            wifiBSSID: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitAdd}
        >
          {({ errors, touched }) => (
            <Form as={CForm}>
              <CModalBody>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputWifiName" className="col-sm-3 col-form-label">
                    Tên Wifi
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="inputWifiName"
                      name="wifiName"
                      invalid={!!(touched.wifiName && errors.wifiName)}
                      feedback={errors.wifiName || ''}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputWifiBSSID" className="col-sm-3 col-form-label">
                    BSSID Wifi
                  </CFormLabel>
                  <CCol sm={9}>
                    <Field
                      as={CFormInput}
                      type="text"
                      id="inputWifiBSSID"
                      name="wifiBSSID"
                      invalid={!!(touched.wifiBSSID && errors.wifiBSSID)}
                      feedback={errors.wifiBSSID || ''}
                    />
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setAddFormVisible(false)}>
                  Đóng
                </CButton>
                <CButton color="primary" type="submit">
                  Thêm
                </CButton>
              </CModalFooter>
            </Form>
          )}
        </Formik>
      </CModal>
    </div>
  );
};

export default WifiInfo;
