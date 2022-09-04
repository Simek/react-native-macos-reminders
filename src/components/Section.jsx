import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import CONSTANTS from '../utils/constants';
import RoundIcon from './RoundIcon';

const Section = ({ title, icon, onPress, count = 0, isActive = false, iconSize = 14 }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tag, isActive ? { backgroundColor: CONSTANTS.COLORS[title] } : {}]}>
    <RoundIcon
      icon={icon}
      isActive={isActive}
      color={CONSTANTS.COLORS[title]}
      iconColor={isActive ? CONSTANTS.COLORS[title] : '#fff'}
      iconSize={iconSize}
      style={styles.tagIcon}
    />
    <Text style={[styles.tagCount, isActive && { color: '#fff' }]}>{count}</Text>
    <Text style={[styles.tagText, isActive && { color: '#fff' }]}>{title}</Text>
    {title === 'today' && (
      <Text style={[styles.tagTodayDay, isActive && { color: CONSTANTS.COLORS[title] }]}>
        {new Date().getDate()}
      </Text>
    )}
  </TouchableOpacity>
);

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
    color: { semantic: 'systemGrayColor' },
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
    color: { semantic: 'systemGrayColor' },
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

export default Section;
