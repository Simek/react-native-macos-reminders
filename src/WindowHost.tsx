import { ReminderListWindow } from '@ui/ReminderList/ReminderListWindow';

type Props = {
  target: string;
};

export default function WindowHost({ target }: Props) {
  if (target === 'ReminderListWindow') {
    return <ReminderListWindow />;
  }
  return null;
}
