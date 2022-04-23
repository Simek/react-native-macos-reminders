import React, { useState } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const Button = ({
  onPress,
  text = '',
  icon = '',
  disabled = false,
  style = null,
  textStyle = null,
  iconStyle = null,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={disabled ? 'transparent' : 'rgba(140,140,140,.1)'}
      onPressIn={(e) => {
        setFocused(true);
        onPress(e);
      }}
      onPressOut={() => setFocused(false)}
      pointerEvents={disabled ? 'none' : 'auto'}
      style={[
        styles.button,
        style,
        disabled && styles.buttonDisabled,
        icon && !text && styles.buttonIconOnly,
      ]}>
      <View style={styles.buttonContent}>
        {icon ? (
          <Text
            style={[
              styles.buttonIcon,
              iconStyle,
              focused && { color: { semantic: 'labelColor' } },
            ]}>
            {icon}
          </Text>
        ) : null}
        {text ? (
          <Text style={[styles.buttonText, icon && styles.buttonTextWithIcon, textStyle]}>
            {text}
          </Text>
        ) : null}
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
  },
  buttonIcon: {
    color: { semantic: 'secondaryLabelColor' },
    fontSize: 17,
    padding: 2,
  },
  buttonText: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 13,
  },
  buttonIconOnly: {
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextWithIcon: {
    paddingLeft: 4,
  },
});

export default Button;
