import React from 'react';
import type { Node } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RoundIcon: () => Node = ({
  icon,
  color = { semantic: 'systemBlueColor' },
  iconColor = '#fff',
  iconSize = 11,
  isActive = false,
  style = undefined,
  iconStyle = undefined,
}) => (
  <View style={[styles.icon, style, { backgroundColor: isActive ? '#fff' : color }]}>
    <Text
      style={[
        {
          fontSize: iconSize,
          lineHeight: iconSize + 2,
          color: iconColor,
        },
        iconStyle,
      ]}>
      {icon}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
});

export default RoundIcon;
