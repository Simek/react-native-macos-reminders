import React from 'react';
import type { Node } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const Button: () => Node = ({
  onPress,
  text = '',
  icon = '',
  disabled = false,
  style = null,
  textStyle = null,
  iconStyle = null,
}) => (
  <TouchableHighlight
    activeOpacity={1}
    underlayColor={disabled ? 'transparent' : 'rgba(140,140,140,.1)'}
    onPress={onPress}
    pointerEvents={disabled ? 'none' : 'auto'}
    style={[styles.button, style, disabled ? styles.buttonDisabled : {}]}>
    <View style={styles.buttonContent}>
      {icon ? <Text style={[styles.buttonIcon, iconStyle]}>{icon}</Text> : null}
      {text ? (
        <Text style={[styles.buttonText, icon ? styles.buttonTextWithIcon : {}, textStyle]}>
          {text}
        </Text>
      ) : null}
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 7,
    paddingVertical: 5,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonTextWithIcon: {
    paddingLeft: 4,
  },
});

export default Button;
