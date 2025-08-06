import { useState } from 'react';
import {
  PlatformColor,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native-macos';

import { TouchableOnPressType } from '~/types';

type Props = {
  text?: string;
  icon?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress?: TouchableOnPressType;
};

export function Button({
  onPress,
  text = '',
  icon = '',
  disabled = false,
  style = null,
  textStyle = null,
  iconStyle = null,
}: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <TouchableHighlight
      activeOpacity={1}
      underlayColor={disabled ? 'transparent' : 'rgba(140,140,140,.1)'}
      onPressIn={(event) => {
        setFocused(true);
        onPress?.(event);
      }}
      onPressOut={() => setFocused(false)}
      // @ts-expect-error FIXME
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
            style={[styles.buttonIcon, iconStyle, focused && { color: PlatformColor('label') }]}>
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
}

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
    color: PlatformColor('secondaryLabel'),
    fontSize: 17,
    padding: 2,
  },
  buttonText: {
    color: PlatformColor('systemGray'),
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
