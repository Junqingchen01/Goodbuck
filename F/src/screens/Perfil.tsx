import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const PerfilScreen = () => {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

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

  const handleUpdateProfile = () => {
    navigation.navigate('EditarPerfil');
  };

  const handleLogout = async () => {
    navigation.navigate('Login');
  };

  const handlePremiumPress = () => {
    navigation.navigate('premium');
  };

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <Image
          source={
            userData.Avatar ? { uri: userData.Avatar } : require('../assets/unknowicon.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.Name}</Text>
          <TouchableOpacity onPress={handlePremiumPress}>
            <Text style={styles.accountType}>
              {userData.AccountType ? userData.AccountType : 'FREE'}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.perfilContainer}>Email: {userData.Email}</Text>
          <Text style={styles.perfilContainer}>Currency Unit: {userData.CurrencyUnit}</Text>
          <Text style={styles.perfilContainer}>User Type: {userData.UserType}</Text>
        </View>
  
        <TouchableOpacity style={styles.actionButton} onPress={handleUpdateProfile}>
          <Text style={styles.actionButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Text style={styles.actionButtonText}>Terminar Sessão</Text>
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
  perfilContainer: {

    alignItems: 'center',
    justifyContent: 'center',
    color: '#3E198C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  actionButton: {
    padding: 10,
    width: 160,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#3E198C',
    marginBottom: 15,
  },
  actionButtonText: {
    color: '#3E198C',
    fontSize: 16,
    fontWeight: 'bold',
  },userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default PerfilScreen;
