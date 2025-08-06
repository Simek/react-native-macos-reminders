import { PropsWithChildren } from 'react';
import { Text, TouchableOpacity, OpaqueColorValue, PlatformColor } from 'react-native-macos';

import { TouchableOnPressType } from '~/types';

type Props = PropsWithChildren<{
  onPress?: TouchableOnPressType;
  disabled?: boolean;
  color?: OpaqueColorValue;
}>;

export function AccentButton({
  children,
  onPress,
  disabled,
  color = PlatformColor('systemGray'),
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Text style={[{ fontSize: 13, color }, disabled && { opacity: 0.4 }]}>{children}</Text>
    </TouchableOpacity>
  );
}
