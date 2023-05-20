import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';
import CONSTANTS from '../utils/constants';

const ReminderItemPopover = ({ item, onStatusChange }) => (
  <View style={styles.popoverWrapper}>
    <View style={styles.popoverTitleWrapper}>
      <Text style={styles.popoverTitle}>{item.text}</Text>
      <Button
        onPress={() => onStatusChange('flagged')}
        text={item.flagged ? '􀋊' : '􀋉'}
        style={styles.popoverFlagButton}
        textStyle={[{ fontSize: 12 }, item.flagged ? { color: CONSTANTS.COLORS.flagged } : {}]}
      />
    </View>
    <Text style={styles.popoverSecondary}>{item.textNote || 'Notes'}</Text>
    <View style={styles.popoverSeparator} />
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.popoverSecondary, styles.popoverLabel]}>priority</Text>
      <Text style={{ color: { semantic: 'labelColor' } }}>None</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  popoverWrapper: {
    minWidth: 280,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  popoverTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: '100%',
  },
  popoverTitle: {
    color: {
      semantic: 'labelColor',
    },
    fontFamily: 'SF Pro Rounded',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  popoverSecondary: {
    color: {
      semantic: 'systemGrayColor',
    },
    fontSize: 13,
  },
  popoverSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: {
      semantic: 'tertiaryLabelColor',
    },
    marginVertical: 8,
  },
  popoverFlagButton: {
    borderColor: {
      semantic: 'quaternaryLabelColor',
    },
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    height: 19,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  popoverLabel: {
    fontSize: 12,
    minWidth: 64,
    textAlign: 'right',
    paddingRight: 8,
    lineHeight: 18,
  },
});

export default ReminderItemPopover;
