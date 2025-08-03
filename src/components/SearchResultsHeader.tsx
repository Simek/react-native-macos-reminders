import React from 'react';
import { Text } from 'react-native-macos';

import styles from '../styles';

type Props = {
  searchQuery: string;
};

function SearchResultsTitle({ searchQuery }: Props) {
  return (
    <Text style={styles.contentHeader} numberOfLines={1} ellipsizeMode="tail">
      Results for “{searchQuery}”
    </Text>
  );
}

export default SearchResultsTitle;
