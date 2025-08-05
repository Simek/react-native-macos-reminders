import { OpaqueColorValue } from 'react-native-macos';
import { TouchableWithoutFeedbackProps } from 'react-native-macos/Libraries/Components/Touchable/TouchableWithoutFeedback';
import { SectionListData } from 'react-native-macos/Libraries/Lists/SectionList';

export type LegacyRemindersType = Record<string, ReminderItemType[]>;

export type RemindersType = Record<
  string,
  { showCompleted?: boolean; reminders: ReminderItemType[] }
>;

export type ReminderItemType = {
  text?: string;
  textNote?: string;
  done: boolean;
  flagged: boolean;
  key: string;
  createdAt: number;
  completedAt: number | null;
};

export type ReminderListItemType = {
  title: string;
  key: string;
  selected: boolean;
  editMode: boolean;
  showCompleted: boolean;
  color?: OpaqueColorValue;
  data?: ReminderItemType[];
};

export type ReminderItemSection = SectionListData<ReminderItemType>;

export type TouchableOnPressType = TouchableWithoutFeedbackProps['onPress'];

export type MeasureOnSuccessParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};
