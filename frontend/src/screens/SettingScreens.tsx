import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          'https://backend-54nz.onrender.com/perfil/user',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error('Error:', response.status);
        }
      } else {
        console.error('AsyncStorage cant find token');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const goToNotification = () => {
    navigation.navigate('NotificationScreens');
  };

  const goToPerfil = () => {
    navigation.navigate('Perfil');
  };

  const goToDefinicoes = () => {
    navigation.navigate('Definicoes');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.notificationIcon} onPress={goToNotification}>
        <Image source={require('../assets/bell7.png')} />
      </TouchableOpacity>
      <View style={styles.userDetails}>
        <Image
          source={userData.Avatar ? { uri: userData.Avatar } : require('../assets/unknowicon.png')}
          style={styles.avatar}
        />
         <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.Name}</Text>
        <Text style={styles.accountType}>
          {userData.AccountType ? userData.AccountType : 'FREE'}
        </Text>
      </View>
        <TouchableOpacity style={styles.settingsOption} onPress={goToPerfil}>
          <Text style={styles.optionText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsOption} onPress={goToDefinicoes}>
          <Text style={styles.optionText}>Definicoes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  notificationIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  userDetails: {
    alignItems: 'center',
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#3E198C',
  },
  accountType: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    borderRadius: 50,
    borderWidth: 2,
    width: 80,
    textAlign: 'center',
    backgroundColor: '#3E198C',
    borderColor: '#3E198C',
    
  },
  settingsOption: {
    padding: 10,
    width: 160,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#3E198C',
    marginBottom: 15, 
    marginTop: 15,
  },
  optionText: {
    color: '#3E198C',
  },userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default SettingsScreen;
