import React from 'react';
import { Text } from 'react-native';

import styles from '../styles';

const SearchResultsTitle = ({ searchQuery }) => (
  <Text style={styles.contentHeader} numberOfLines={1} ellipsizeMode="tail">
    Results for “{searchQuery}”
  </Text>
);

export default SearchResultsTitle;
