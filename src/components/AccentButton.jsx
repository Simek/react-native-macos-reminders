import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const AccentButton = ({ children, onPress, disabled, color = { semantic: 'systemGrayColor' } }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <Text style={[{ fontSize: 13, color }, disabled && { opacity: 0.4 }]}>{children}</Text>
  </TouchableOpacity>
);

export default AccentButton;
