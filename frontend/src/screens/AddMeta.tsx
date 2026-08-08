import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { Picker } from '@react-native-picker/picker';

const AddMetaScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [plannedContribution, setPlannedContribution] = useState('');
  const [currentContribution, setCurrentContribution] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');

  const priorities = ['Importante', 'Normal'];

  const handleAddMeta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('https://backend-54nz.onrender.com/metas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Name: name,
          StartDate: startDate,
          EndDate: endDate,
          PlannedContribution: parseFloat(plannedContribution),
          CurrentContribution: parseFloat(currentContribution),
          Description: description,
          Priority: priority,
        }),
      });

      if (response.ok) {
        Alert.alert('Meta adicionada com sucesso');
        setName('');
        setStartDate('');
        setEndDate('');
        setPlannedContribution('');
        setCurrentContribution('');
        setDescription('');
        setPriority('');
        navigation.navigate('Metas');
      } else {
        Alert.alert('Erro ao adicionar meta', `Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro durante a adição de meta:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a adição de meta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Meta</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Início"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Término"
        value={endDate}
        onChangeText={setEndDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Contribuição Planejada"
        value={plannedContribution}
        onChangeText={setPlannedContribution}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Contribuição Atual"
        value={currentContribution}
        onChangeText={setCurrentContribution}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />
      <Picker
        selectedValue={priority}
        onValueChange={(itemValue, itemIndex) => setPriority(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione uma Prioridade" value="" />
        {priorities.map((priority) => (
          <Picker.Item label={priority} value={priority} key={priority} />
        ))}
      </Picker>
      <TouchableOpacity style={styles.btn} onPress={handleAddMeta}>
        <Text style={styles.btntext}>Registar</Text>
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
  },
});

export default AddMetaScreen;
