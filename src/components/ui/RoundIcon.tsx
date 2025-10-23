import {
  StyleSheet,
  Text,
  View,
  PlatformColor,
  OpaqueColorValue,
  StyleProp,
  ViewStyle,
} from 'react-native-macos';

type Props = {
  icon: string;
  color?: OpaqueColorValue;
  iconColor?: OpaqueColorValue | string;
  iconSize?: number;
  size?: number;
  isActive?: boolean;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
};

export function RoundIcon({
  icon,
  color = PlatformColor('systemBlueColor'),
  iconColor = '#fff',
  iconSize = 11,
  size = 23,
  isActive = false,
  style = undefined,
  iconStyle = undefined,
}: Props) {
  return (
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
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 100,
    paddingLeft: 1.5,
  },
});
