import React, { useEffect, useRef, useState } from 'react'
import axiosClient from '../../../axios/axios-client'
import { useParams } from 'react-router-dom'
import Select from 'react-select'
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
  CModalHeader,
  CModalTitle,
  CForm,
  CModalBody,
  CRow,
  CFormLabel,
  CCol,
  CModalFooter,
  CButton,
  CModal,
  CSpinner,
} from '@coreui/react'
import { toast } from 'react-toastify'

const RegisterClassroom = () => {
  const [classrooms, setClassrooms] = useState([])
  const [studentList, setStudentList] = useState([]) //Toàn bộ danh sách sinh viên theo mã lớp
  const [students, setStudents] = useState([]) //Toàn bộ danh sách sinh viên
  const [addFormVisible, setAddFormVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const addFrom = useRef()
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    getStudentList() //Lấy toàn bộ danh sách sinh viên theo mã lớp
    getClassroom()
    getStudents() //Lấy toàn bộ danh sách sinh viên
  }, [])

  const classroomId = useParams().classroomId

  const getClassroom = () => {
    axiosClient
      .get('/admin/classrooms')
      .then((response) => {
        setClassrooms(response?.data?.data?.classrooms)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getStudents = () => {
    axiosClient
      .get('/admin/students')
      .then((response) => {
        setStudents(response?.data?.data?.students)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getStudentList = () => {
    axiosClient
      .get(`/admin/classrooms/${classroomId}`)
      .then((response) => {
        console.log(response)
        setStudentList(response?.data?.data?.classroom.students)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSubmitAdd = (e) => {
    e.preventDefault()
    if (studentList.includes(selectedStudent)) {
      toast.error('Sinh viên đã có trong danh sách')
      addFrom.current.reset()
      setAddFormVisible(false)
      return
    }
    setStudentList([...studentList, selectedStudent])
  }

  return (
    <div>
      <CCard>
        <div className={'d-flex justify-content-between m-2'}>
          <CDropdown>
            <CDropdownToggle color="secondary">Chọn lớp</CDropdownToggle>
            <CDropdownMenu>
              {classrooms?.map((classroom) => (
                <CDropdownItem
                  key={classroom.id}
                  href={`/admin/register-classroom/${classroom.id}`}
                >
                  {`${classroom.term.termName} (mã lớp: ${classroom.id})`}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setAddFormVisible(!addFormVisible)}
          >
            Thêm
          </button>
          <button type="button" className="btn btn-success">
            Lưu
          </button>
        </div>
        <div className={'m-2'}>
          {loading ? (
            <CSpinner />
          ) : (
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
                    Giới tính
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {studentList.map((student, index) => (
                  <CTableRow key={student.code}>
                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{student.code}</CTableDataCell>
                    <CTableDataCell>{student.famMidName}</CTableDataCell>
                    <CTableDataCell>{student.name}</CTableDataCell>
                    <CTableDataCell>{student.gender}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </div>
      </CCard>
      <CModal backdrop="static" visible={addFormVisible} onClose={() => setAddFormVisible(false)}>
        <CModalHeader>
          <CModalTitle>Thêm sinh viên</CModalTitle>
        </CModalHeader>
        <CForm ref={addFrom} onSubmit={handleSubmitAdd} method="POST ">
          <CModalBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputStudent" className="col-sm-3 col-form-label">
                Chọn sinh viên
              </CFormLabel>
              <CCol sm={9}>
                <Select
                  name="student"
                  onChange={(selectedOption) => setSelectedStudent(selectedOption.value)}
                  options={students.map((student) => ({
                    value: student,
                    label: `${student.fullname} (MSSV: ${student.code})`,
                  }))}
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
        </CForm>
      </CModal>
    </div>
  )
}

export default RegisterClassroom
