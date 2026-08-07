import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; 


const UpdateMeta = ({ route, navigation }) => {
  const { MetaID } = route.params;
  const [metaDetail, setMetaDetail] = useState({});
  const [plannedContribution, setPlannedContribution] = useState('');
  const [currentContribution, setCurrentContribution] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Importante'); 
  

  useEffect(() => {
    const fetchMetaDetail = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch(`https://backend-54nz.onrender.com/metas/${MetaID}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
      
          if (response.ok) {
            const data = await response.json();
            const priority = data.Priority || 'DefaultPriority';
            setMetaDetail({ ...data, Priority: priority });
          } else {
            console.error('Error:', response.status);
          }
        } catch (error) {
          console.error('Error fetching meta detail:', error);
        }
      };
      
  
    fetchMetaDetail();
  }, [MetaID]);


  const handleUpdateMeta = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`https://backend-54nz.onrender.com/metas/${MetaID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          PlannedContribution: plannedContribution,
          CurrentContribution: currentContribution,
          Description: description,
          Priority: priority,
        }),
      });

      if (response.ok) {
        navigation.goBack();
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>{`Update Meta - MetaID: ${MetaID}`}</Text>
      <TextInput
        style={styles.input}
        placeholder="Planned Contribution"
        value={plannedContribution}
        onChangeText={(text) => setPlannedContribution(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Contribution"
        value={currentContribution}
        onChangeText={(text) => setCurrentContribution(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />

      <Text style={styles.label}>Priority:</Text>
      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="Importante" value="Importante" />
        <Picker.Item label="Normal" value="Normal" />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleUpdateMeta}>
        <Text style={styles.buttonText}>Update Meta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#FFFFF7',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3E198C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default UpdateMeta;
