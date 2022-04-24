import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const RemindersListFooter = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.listFooter} onPress={onPress} activeOpacity={1}>
      <Text style={styles.listFooterText}>
        <Text style={styles.listFooterTextIcon}>􀁌</Text> Add List
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listFooter: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    opacity: 0.5,
  },
  listFooterText: {
    color: { semantic: 'textColor' },
    fontSize: 13,
  },
  listFooterTextIcon: {
    flex: 1,
    color: { semantic: 'textColor' },
    fontSize: 14,
    marginRight: 2,
  },
});

export default RemindersListFooter;
