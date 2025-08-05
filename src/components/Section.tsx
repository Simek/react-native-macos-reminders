import { useState } from 'react';
import { StyleSheet, Text, PlatformColor, Pressable } from 'react-native-macos';

import RoundIcon from './RoundIcon';

import { useAppContext } from '~/context/AppContext.tsx';
import { TouchableOnPressType } from '~/types.ts';
import { COLORS } from '~/utils/constants';

type Props = {
  title: string;
  icon: string;
  onPress: TouchableOnPressType;
  count?: number;
  isActive?: boolean;
  iconSize?: number;
};

export default function Section({
  title,
  icon,
  onPress,
  count = 0,
  isActive = false,
  iconSize = 14,
}: Props) {
  const { setSearchMode, setPreviousSelectedKey } = useAppContext();

  const [isPressed, setIsPressed] = useState(false);
  const isHighlighted = isActive || isPressed;

  return (
    <Pressable
      onPress={(event) => {
        onPress?.(event);
        setPreviousSelectedKey(title);
        setSearchMode(false);
      }}
      onPressIn={() => {
        setIsPressed(true);
      }}
      onPressOut={() => {
        setIsPressed(false);
      }}
      style={[styles.tag, isHighlighted ? { backgroundColor: COLORS[title] } : {}]}>
      <RoundIcon
        icon={icon}
        isActive={isHighlighted}
        color={COLORS[title]}
        iconColor={isHighlighted ? COLORS[title] : '#fff'}
        iconSize={iconSize}
        style={styles.tagIcon}
      />
      {title !== 'completed' && (
        <Text style={[styles.tagCount, isHighlighted && { color: '#fff' }]}>{count}</Text>
      )}
      <Text style={[styles.tagText, isHighlighted && { color: '#fff' }]}>{title}</Text>
      {title === 'today' && (
        <Text style={[styles.tagTodayDay, isHighlighted && { color: COLORS[title] }]}>
          {new Date().getDate()}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: 'rgba(140,140,140,.2)',
    width: '48.5%',
    paddingHorizontal: 10,
    padding: 8,
    marginBottom: 7,
    borderRadius: 10,
  },
  tagText: {
    fontWeight: '500',
    fontSize: 13.5,
    fontFamily: 'SF Pro Rounded',
    color: PlatformColor('systemGray'),
    textTransform: 'capitalize',
  },
  tagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 5,
  },
  tagCount: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'SF Pro Rounded',
    color: PlatformColor('systemGray'),
  },
  tagTodayDay: {
    position: 'absolute',
    width: 9,
    top: 17.5,
    left: 17.5,
    fontSize: 6.5,
    color: '#fff',
    textAlign: 'center',
  },
});
