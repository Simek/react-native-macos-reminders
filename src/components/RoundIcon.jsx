import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const RoundIcon = ({
  icon,
  color = { semantic: 'systemBlueColor' },
  iconColor = '#fff',
  iconSize = 11,
  size = 23,
  isActive = false,
  style = undefined,
  iconStyle = undefined,
}) => (
  <View
    style={[
      styles.icon,
      style,
      {
        backgroundColor: isActive ? '#fff' : color,
        width: size,
        height: size,
      },
    ]}>
    <Text
      style={[
        {
          fontSize: iconSize,
          lineHeight: iconSize + 3,
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
    paddingLeft: 2,
  },
});

export default RoundIcon;
