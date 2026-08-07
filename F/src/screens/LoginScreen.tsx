import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { TouchableOpacity } from 'react-native';


const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://backend-54nz.onrender.com/perfil/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: username,
          Password: password,
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        const token = result.token;
  
        await AsyncStorage.removeItem('token');
  
        await AsyncStorage.setItem('token', token);
  
        Alert.alert('Login Successful');
        navigation.navigate('Home');
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };
  

  const gotoRegistar = () => {
    navigation.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <View>
      <Text style={styles.title}>Bem-vindo de volta!</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btntext} >Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={gotoRegistar}>
          <Text style={styles.btntext} >Registar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent:'center',
    padding: 16,
    backgroundColor: '#FFFFF7',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#3E198C',
    fontFamily: 'TeX Gyre Heros',
    fontStyle: 'normal',
    fontWeight: '700',
    

  },
  input: {
    height: 40,
    borderColor: '#3E198C', 
    borderWidth: 2, 
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#E8CBF6', 
  },
  btn:{
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 70,
    borderColor: '#3E198C', 
    borderWidth: 6, 
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 238,
    height: 50,
    
  },
  btntext:{
    color: '#3E198C',
    fontSize: 20,
    textAlign: 'center', 
    fontFamily: 'TeX Gyre Heros',
    fontStyle: 'normal',
    fontWeight: '700',
  }
});

export default LoginScreen;
