import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';

const AdicionarDespesaScreen = () => {
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const categories = ['Casa', 'Jogo', 'Carro', 'Comida', 'Saúde', 'Família', 'Trabalho', 'Roupas', 'Outros'];

  const handleAddDespesa = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(
        'https://backend-54nz.onrender.com/despesas/'

        , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Category: category,
          PaymentMethod: paymentMethod,
          Amount: amount,
          Description: description,
        }),
      });

      if (response.ok) {
        Alert.alert('Despesa adicionada com sucesso');
        setCategory('');
        setPaymentMethod('');
        setAmount('');
        setDescription('');
        goBackAndRefresh()
      } else {
        Alert.alert('Erro ao adicionar despesa', `Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro durante a adição de despesa:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a adição de despesa');
    }
  };

  const goBackAndRefresh = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Despesa</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categories.map((category) => (
          <Picker.Item label={category} value={category} key={category} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Método de Pagamento"
        value={paymentMethod}
        onChangeText={setPaymentMethod}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.btn} onPress={handleAddDespesa}>
        <Text style={styles.btntext} >Registar</Text>
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
    marginLeft: 70,
    borderColor: '#3E198C',
    borderWidth: 5,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: 238,
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

export default AdicionarDespesaScreen;
