import { OpaqueColorValue, PlatformColor } from 'react-native-macos';

export const COLORS: Record<string, OpaqueColorValue> = {
  all: PlatformColor('secondaryLabel'),
  scheduled: PlatformColor('systemRed'),
  today: PlatformColor('systemBlue'),
  flagged: PlatformColor('systemOrange'),
  completed: PlatformColor('systemGray'),
};

export const PREDEFINED_KEYS = ['all', 'scheduled', 'today', 'flagged', 'completed'];

export const INIT_STORE = {
  today: [],
  scheduled: [],
  flagged: [],
  all: [],
  completed: [],
};
