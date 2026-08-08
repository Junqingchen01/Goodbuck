import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const EditarPerfilScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [currencyUnit, setCurrencyUnit] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('https://backend-54nz.onrender.com/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          Password: password,
          Avatar: avatar,
          CurrencyUnit: currencyUnit,
        }),
      });

      if (response.ok) {
        Alert.alert('Perfil atualizado com sucesso');
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Erro ao atualizar perfil', `Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro durante a atualização de perfil:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a atualização de perfil');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="URL do Avatar"
        value={avatar}
        onChangeText={setAvatar}
      />
      <TextInput
        style={styles.input}
        placeholder="Unidade Monetária"
        value={currencyUnit}
        onChangeText={setCurrencyUnit}
      />
      <TouchableOpacity style={styles.btn} onPress={handleUpdateProfile}>
        <Text style={styles.btntext}>Atualizar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#3E198C',
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
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3E198C',
    borderWidth: 5,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
    height: 50,
  },
  btntext: {
    color: '#3E198C',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'TeX Gyre Heros',
    fontStyle: 'normal',
    fontWeight: '700',
  }
});

export default EditarPerfilScreen;
