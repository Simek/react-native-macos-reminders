import { StyleSheet, PlatformColor } from 'react-native-macos';

const styles = StyleSheet.create({
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
    paddingTop: 52,
  },
  contentHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentHeader: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'SF Pro Rounded',
    lineHeight: 38,
    color: PlatformColor('secondaryLabel'),
  },
  contentHeaderCustom: {
    textTransform: 'capitalize',
  },
  contentHeaderCounter: {
    marginLeft: 36,
    marginRight: 16,
    fontWeight: '400',
  },
  completedHeader: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingRight: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  completedTextWrapper: {
    flexDirection: 'row',
  },
  completedText: {
    color: PlatformColor('systemGray'),
    fontSize: 13,
  },
  completedVisibleText: {
    color: PlatformColor('tertiaryLabel'),
    fontSize: 13,
  },
  noContentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  noContentText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'SF Pro Rounded',
    color: PlatformColor('secondaryLabel'),
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
  addItemButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 9999,
  },
});

export default styles;
