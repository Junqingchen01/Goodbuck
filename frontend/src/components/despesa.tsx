import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DespesaDetail = ({ route }) => {
  const { DespesaID } = route.params;
  const [despesaDetail, setDespesaDetail] = useState(null);

  useEffect(() => {
    const fetchDespesaDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`https://backend-54nz.onrender.com/despesas/${DespesaID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDespesaDetail(data.despesa);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDespesaDetail();
  }, [DespesaID]);

  if (!despesaDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} >{` ${despesaDetail.Description}`}</Text>
      <Text style={styles.category} >{`${despesaDetail.Category}`}</Text>
      <Text style={styles.info}>{`Amount: ${despesaDetail.Amount}`}</Text>
      <Text style={styles.info} >{`PaymentMethod: ${despesaDetail.PaymentMethod}`}</Text>
      <Text style={styles.subinfo}>{`Date: ${despesaDetail.Date}`}</Text>
      <Text style={styles.subinfo}>{`DespesaID: ${despesaDetail.DespesaID}`}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: '#FFFFF7',
    padding: 16,
  },title:{
    fontSize: 30,
    color: 'black',
    marginLeft: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },category:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    borderRadius: 50,
    borderWidth: 2,
    width: 100,
    textAlign: 'center',
    backgroundColor: '#3E198C',
    borderColor: '#3E198C',
    marginLeft: 150,
  },info:{
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    width: 380,
    textAlign: 'center',
  },subinfo:{
    justifyContent:'flex-end',
    fontSize: 15,
    width: 500,
  }
});

export default DespesaDetail;
