
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MetaDetail = ({ route, navigation }) => {
  const { MetaID } = route.params;
  const [metaDetail, setMetaDetail] = useState(null);

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
          setMetaDetail(data);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching meta detail:', error);
      }
    };
    
    

    fetchMetaDetail();
  }, [MetaID]);

  const handleUpdateMeta = () => {
    navigation.navigate('EditarMeta', { MetaID });
  };

  const handleDeleteMeta = async () => {
    try {
      Alert.alert(
        'delect',
        'Tens certeza queres deletar?',
        [
          {
            text: 'cancelar',
            style: 'cancel',
          },
          {
            text: 'dalect',
            onPress: async () => {
              const token = await AsyncStorage.getItem('token');
              const response = await fetch(`https://backend-54nz.onrender.com/metas/${MetaID}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
  
              if (response.ok) {
                navigation.goBack();
              } else {
                console.error('Error:', response.status);
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!metaDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name: {metaDetail.Name}</Text>
      <Text style={styles.text}>Description: {metaDetail.Description}</Text>
      <Text style={styles.amount}>{metaDetail.CurrentContribution} / {metaDetail.PlannedContribution}</Text>
      <Text style={styles.text}>Start Date: {metaDetail.StartDate}</Text>
      <Text style={styles.text}>End Date: {metaDetail.EndDate}</Text>
      <Text style={styles.text}>Priority: {metaDetail.Priority}</Text>
      <Text style={styles.text}>MetaID: {metaDetail.MetaID}</Text>
  
      <TouchableOpacity style={styles.button} onPress={handleUpdateMeta}>
        <Text style={styles.buttonText}>Update Meta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDeleteMeta}>
        <Text style={styles.buttonText}>Delete Meta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    textAlign: 'center', 
    flex: 1,
    backgroundColor: '#FFFFF7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E198C',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  button: {
    width: 150,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3E198C',
    backgroundColor: '#E8CBF6',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  amount: {
    color: '#3E198C',
    fontWeight: 'bold',
    fontSize: 30,
  },
});

export default MetaDetail;
