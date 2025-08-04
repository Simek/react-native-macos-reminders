import { Text } from 'react-native-macos';

import sharedStyles from '~/sharedStyles.ts';

type Props = {
  searchQuery: string;
};

function SearchResultsTitle({ searchQuery }: Props) {
  return (
    <Text style={sharedStyles.contentHeader} numberOfLines={1} ellipsizeMode="tail">
      Results for “{searchQuery}”
    </Text>
  );
}

export default SearchResultsTitle;
