import React from 'react';
import type { Node } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import CONSTANTS from '../constants';
import RoundIcon from './RoundIcon';

const Tag: () => Node = ({ title, icon, onPress, count = 0, isActive = false }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.tag,
      isActive ? { backgroundColor: CONSTANTS.COLORS[title.toLowerCase()] } : {},
    ]}>
    <RoundIcon
      icon={icon}
      isActive={isActive}
      color={CONSTANTS.COLORS[title.toLowerCase()]}
      iconColor={isActive ? CONSTANTS.COLORS[title.toLowerCase()] : '#fff'}
      iconSize={14}
      style={styles.tagIcon}
    />
    <Text style={[styles.tagCount, isActive ? { color: '#fff' } : {}]}>{count}</Text>
    <Text style={[styles.tagText, isActive ? { color: '#fff' } : {}]}>{title}</Text>
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
});

export default Tag;
