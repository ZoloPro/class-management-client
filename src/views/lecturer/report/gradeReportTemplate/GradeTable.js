import React from 'react';
import { StyleSheet, View, Text } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
});

const GradeTable = ({ data }) => {
  return (
    <View style={styles.table}>
      {/* Header Row */}
      <View style={styles.tableRow}>
        <View style={styles.tableCell}>
          <Text>#</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Mã sinh viên</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Họ và lót</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Tên</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm chuyên cần</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm 1</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm 2</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm 3</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm 1</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm 2</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm thi</Text>
        </View>
        <View style={styles.tableCell}>
          <Text>Điểm trung bình</Text>
        </View>
      </View>
    </View>
  );
};

export default GradeTable;
