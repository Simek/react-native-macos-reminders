import React from 'react';
import type { Node } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

const Button: () => Node = ({
  onPress,
  text = '',
  disabled = false,
  style = null,
  textStyle = null,
}) => (
  <TouchableHighlight
    activeOpacity={1}
    underlayColor={disabled ? { semantic: 'controlColor' } : 'rgba(140,140,140,.1)'}
    onPress={onPress}
    pointerEvents={disabled ? 'none' : 'auto'}
    style={[styles.button, style, disabled ? styles.buttonDisabled : {}]}>
    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 6,
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 9999,
  },
  buttonText: {
    color: { semantic: 'secondaryLabelColor' },
    fontSize: 17,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});

export default Button;
