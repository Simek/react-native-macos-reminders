import { StyleSheet } from 'react-native';

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
  listHeader: {
    fontSize: 11,
    marginBottom: 4,
    paddingHorizontal: 20,
    color: { semantic: 'systemGrayColor' },
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItemSelected: {
    backgroundColor: {
      semantic: 'selectedContentBackgroundColor',
    },
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
  listFooter: {
    padding: 8,
    flexDirection: 'row',
  },
  listFooterText: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 13,
  },
  listFooterTextIcon: {
    color: { semantic: 'systemGrayColor' },
    fontSize: 14,
    lineHeight: 14,
  },
  content: {
    backgroundColor: { semantic: 'controlBackgroundColor' },
    flex: 1,
    flexGrow: 2,
    paddingLeft: 20,
    paddingTop: 52,
  },
  contentHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentStickyHeaderWrapper: {
    backgroundColor: { semantic: 'controlBackgroundColor' },
  },
  contentHeader: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'secondaryLabelColor' },
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#8c8c8c50',
    paddingVertical: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    color: { semantic: 'labelColor' },
    fontSize: 13,
  },
  noContentWrapper: {
    justifyContent: 'center',
    flex: 1,
  },
  noContentText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'secondaryLabelColor' },
  },
  remindersHeader: {
    paddingVertical: 6,
    fontSize: 20,
    fontFamily: 'SF Pro Rounded',
    color: { semantic: 'systemBlueColor' },
  },
  allListHeader: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 12,
    color: { semantic: 'systemBlueColor' },
  },
  searchHeader: {
    marginBottom: 19.5,
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
