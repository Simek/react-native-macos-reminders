import { StyleSheet, Text, TouchableOpacity, PlatformColor } from 'react-native-macos';

import { TouchableOnPressType } from '~/types.ts';

type Props = {
  onPress: TouchableOnPressType;
};

export default function RemindersListFooter({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.listFooter} onPress={onPress} activeOpacity={1}>
      <Text style={styles.listFooterText}>
        <Text style={styles.listFooterTextIcon}>􀁌</Text> Add List
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listFooter: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    opacity: 0.5,
  },
  listFooterText: {
    color: PlatformColor('text'),
    fontSize: 13,
  },
  listFooterTextIcon: {
    flex: 1,
    color: PlatformColor('text'),
    fontSize: 14,
    marginRight: 2,
  },
});
