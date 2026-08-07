import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoadingAnimation = ({ navigation }) => {
  React.useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      navigation.replace('Login');
    }, 10000); // Change the duration to 10 seconds

    return () => clearTimeout(loadingTimeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/animacaologin.gif')} 
        style={styles.gif}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: 430,
    height: 932,
  },
});

export default LoadingAnimation;