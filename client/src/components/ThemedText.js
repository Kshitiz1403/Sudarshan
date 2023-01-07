import { Text } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ThemedText = ({ style, children, inverse = false }) => {
  const themeColors = useTheme().colors;
  const isDarkMode = useSelector(state => state.theme.isDark);

  return <Text style={{ color: !inverse ? themeColors.text : (isDarkMode ? "#1c1c1e" : "#e5e5e7"), ...style }}>{children}</Text>;
};

export default ThemedText;
