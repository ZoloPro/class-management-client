import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import GradeReportTemplate from '../gradeReportTemplate/GradeReportTemplate';
import { CCard } from '@coreui/react';

const GradeReport = () => {
  return (
    <PDFViewer className="w-100" style={{ height: '1000px' }} width={100}>
      <GradeReportTemplate />
    </PDFViewer>
  );
};

export default GradeReport;
