import { Text } from 'react-native-macos';

import sharedStyles from '~/sharedStyles';

type Props = {
  searchQuery: string;
};

export function SearchResultsHeader({ searchQuery }: Props) {
  return (
    <Text style={sharedStyles.contentHeader} numberOfLines={1} ellipsizeMode="tail">
      Results for “{searchQuery}”
    </Text>
  );
}
