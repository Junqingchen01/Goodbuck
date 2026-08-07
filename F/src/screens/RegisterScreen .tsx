import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('https://backend-54nz.onrender.com/perfil/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: username,
          Email: email,
          Password: password,
        }),
      });
  
      if (response.ok) {
        Alert.alert('Register Successful', 'User created');
        setUsername('');
        setPassword('');
        setEmail('');
        navigation.navigate('Login');
      } else {
        Alert.alert('Register Failed', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Error during register:', error);
      Alert.alert('Error', 'An error occurred during register');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Goodbuck!</Text>
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
       <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btntext}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
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
    
  }, btntext:{
    color: '#3E198C',
    fontSize: 20,
    textAlign: 'center', 
    fontFamily: 'TeX Gyre Heros',
    fontStyle: 'normal',
    fontWeight: '700',
  }
  
});

export default RegisterScreen;
