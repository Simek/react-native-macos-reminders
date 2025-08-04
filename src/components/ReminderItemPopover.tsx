import { StyleSheet, Text, View, PlatformColor } from 'react-native-macos';

import Button from './Button';

import { ReminderItemType } from '~/types.ts';
import { COLORS } from '~/utils/constants';

type Props = {
  item: ReminderItemType;
  onStatusChange: (fieldName: keyof ReminderItemType) => void;
};

function ReminderItemPopover({ item, onStatusChange }: Props) {
  return (
    <View style={styles.popoverWrapper}>
      <View style={styles.popoverTitleWrapper}>
        <Text style={styles.popoverTitle}>{item.text}</Text>
        <Button
          onPress={() => onStatusChange('flagged')}
          text={item.flagged ? '􀋊' : '􀋉'}
          style={styles.popoverFlagButton}
          textStyle={[styles.popoverFlagButtonText, item.flagged ? { color: COLORS.flagged } : {}]}
        />
      </View>
      <Text style={styles.popoverSecondary}>{item.textNote || 'Notes'}</Text>
      <View style={styles.popoverSeparator} />
      <View style={{ flexDirection: 'row' }}>
        <Text style={[styles.popoverSecondary, styles.popoverLabel]}>priority</Text>
        <Text style={{ color: PlatformColor('label') }}>None</Text>
      </View>
    </View>
  );
}

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
    color: PlatformColor('label'),
    fontFamily: 'SF Pro Rounded',
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  popoverSecondary: {
    color: PlatformColor('systemGray'),
    fontSize: 13,
  },
  popoverSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: PlatformColor('tertiaryLabel'),
    marginVertical: 8,
  },
  popoverFlagButton: {
    borderColor: PlatformColor('quaternaryLabel'),
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
    height: 19,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  popoverFlagButtonText: {
    fontSize: 12,
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
