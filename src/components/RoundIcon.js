import React from 'react';
import type { Node } from 'react';
import { Text, View } from 'react-native';

const RoundIcon: () => Node = ({
  icon,
  color = { semantic: 'systemBlueColor' },
  iconColor = '#fff',
  iconSize = 11,
  isActive = false,
  style = undefined,
}) => (
  <View style={[style, { backgroundColor: isActive ? '#fff' : color }]}>
    <Text
      style={{
        fontSize: iconSize,
        lineHeight: iconSize % 2 === 0 ? iconSize + 1 : iconSize + 2,
        color: iconColor,
      }}>
      {icon}
    </Text>
  </View>
);

export default RoundIcon;
