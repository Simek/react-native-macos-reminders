import React from 'react';
import type { Node } from 'react';
import { Text, View } from 'react-native';

const RoundIcon: () => Node = ({
  icon,
  color = { semantic: 'systemBlueColor' },
  textColor = '#fff',
  isActive = false,
  style = undefined,
}) => (
  <View style={[style, { backgroundColor: isActive ? '#fff' : color }]}>
    <Text style={{ fontSize: 11, lineHeight: 14, color: textColor }}>
      {icon}
    </Text>
  </View>
);

export default RoundIcon;
