import { StyleSheet, PlatformColor } from 'react-native-macos';

const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sourceList: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#8c8c8c33',
    maxWidth: 280,
    flexGrow: 1,
    paddingTop: 52,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemSelected: {
    backgroundColor: PlatformColor('selectedContentBackground'),
  },
  listItemIcon: {
    width: 20,
    height: 20,
    padding: 2,
    marginRight: 8,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 20,
    flexGrow: 99,
  },
  content: {
    backgroundColor: PlatformColor('controlBackground'),
    flex: 1,
    flexGrow: 2,
    paddingLeft: 20,
    paddingTop: 58,
  },
  completedVisibleText: {
    color: PlatformColor('tertiaryLabel'),
    fontSize: 13,
  },
  remindersHeader: {
    paddingVertical: 6,
    fontSize: 20,
    fontFamily: 'SF Pro Rounded',
    color: PlatformColor('systemBlue'),
  },
  addReminderRow: {
    width: '100%',
    height: 48,
  },
});

export default sharedStyles;
