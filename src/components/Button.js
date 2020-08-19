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
    underlayColor={
      disabled ? { semantic: 'controlColor' } : { semantic: 'selectedContentBackgroundColor' }
    }
    onPress={onPress}
    pointerEvents={disabled ? 'none' : 'auto'}
    style={[styles.button, style, disabled ? styles.buttonDisabled : {}]}>
    <Text style={[styles.buttonText, textStyle]}>{text}</Text>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: { semantic: 'controlColor' },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8c8c8c70',
    paddingHorizontal: 12,
    height: 18,
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    right: 12,
  },
  buttonText: {
    color: { semantic: 'labelColor' },
    fontWeight: '100',
    fontSize: 22,
    lineHeight: 20,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});

export default Button;
