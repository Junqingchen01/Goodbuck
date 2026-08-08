// Definicoes.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DefinicoesScreen = () => {
  const handleLanguageChange = () => {
    // Implement language change functionality
  };

  const handleDarkModeToggle = () => {
    // Implement dark mode toggle functionality
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.option} onPress={handleLanguageChange}>
        <Text>Linguagem</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleDarkModeToggle}>
        <Text>Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  option: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default DefinicoesScreen;
