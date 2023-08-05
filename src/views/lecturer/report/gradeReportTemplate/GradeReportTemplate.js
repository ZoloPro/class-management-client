import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import GradeTable from './GradeTable';

// Register font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: '3cm 2cm',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '16.7%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});

// Create Document Component
const GradeReportTemplate = () => (
  <Document>
    <Page style={styles.page}>
      <View>
        <GradeTable />
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Điểm</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'A (...>8.5)'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'B (7.0≤...<8.5)'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'C (5.5≤...<7.0)'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'D (4.0≤...<5.5)'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'F (...≤4.0)'}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{'Số lượng'}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>32 (45%)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>32 (45%)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>32 (45%)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>32 (45%)</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>32 (45%)</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
export default GradeReportTemplate;
