import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const RemindersListFooter = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.listFooter} onPress={onPress}>
      <Text style={styles.listFooterText}>
        <Text style={styles.listFooterTextIcon}>􀁌 </Text> Add List
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listFooter: {
    padding: 8,
    flexDirection: 'row',
  },
  listFooterText: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 13,
  },
  listFooterTextIcon: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 14,
    lineHeight: 14,
  },
});

export default RemindersListFooter;
