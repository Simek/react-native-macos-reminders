import { StyleSheet, Text, TouchableOpacity, PlatformColor } from 'react-native-macos';

import { TouchableOnPressType } from '~/types';

type Props = {
  onPress: TouchableOnPressType;
};

export function ClearButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      onPressIn={onPress}
      style={[styles.searchInputIcon, styles.searchInputClearIcon]}>
      <Text style={styles.searchInputClearIconText}>􀁑</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  searchInputIcon: {
    position: 'absolute',
    fontSize: 14,
    top: 2,
    color: PlatformColor('label'),
    cursor: 'pointer',
    padding: 4,
  },
  searchInputClearIcon: {
    right: 14,
  },
  searchInputClearIconText: {
    color: PlatformColor('label'),
  },
});
