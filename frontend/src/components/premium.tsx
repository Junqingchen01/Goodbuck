import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PremiumScreen = ({ navigation }) => {
    const [premiumData, setPremiumData] = useState(null);
    const [plan, setPlan] = useState('');
    const [price, setPrice] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [transactionCode, setTransactionCode] = useState('');
  
    useEffect(() => {
      fetchPremiumData();
    }, []);
  
    const fetchPremiumData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(
            'https://backend-54nz.onrender.com/perfil/Premium',
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
            setPremiumData(data.premium);
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
  
    const handleSubmit = async () => {
      // Validate input fields
      if (!plan || !price || !paymentMethod || !transactionCode) {
        alert('Please fill in all fields.');
        return;
      }
  
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(
            'https://backend-54nz.onrender.com/perfil/Premium',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                Plan: plan,
                Price: price,
                PaymentMethod: paymentMethod,
                TransactionCode: transactionCode,
              }),
            }
          );
          if (response.ok) {
            console.log('Premium purchase successful!');
            // Refresh premium data after successful purchase
            fetchPremiumData();
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
  return (
    <View style={styles.container}>
      {premiumData ? (
        // Display premium information
        <View>
        <Text style={styles.title} >Plan: {premiumData.Plan}</Text>
        <Text style={styles.title}>Status: {premiumData.Status}</Text>
          <Text style={styles.info}>Start Date: {premiumData.StartDate}</Text>
          <Text style={styles.info}>End Date: {premiumData.EndDate}</Text>
          <View style={styles.subinfo}>
            <Text >Payment Method: {premiumData.PaymentMethod}</Text>
            <Text >Transaction Code: {premiumData.TransactionCode}</Text>
            <Text >Premium ID: {premiumData.PremiumID}</Text>
          </View>
          

        </View>
      ) : (
        // Display form and purchase information
        <View>
          <Text style={styles.notVipMessage}>
            You are not our VIP. Do you want to Join us?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Plan"
            value={plan}
            onChangeText={setPlan}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Payment Method"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Transaction Code"
            value={transactionCode}
            onChangeText={setTransactionCode}
          />
          
          <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                <Text style={styles.btntext} >Join Us</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    notVipMessage: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'red',
      marginBottom: 10,
    },
    purchaseButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#3E198C',
      borderRadius: 8,
      alignItems: 'center',
    },
    purchaseButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },title:{
        fontSize: 30,
        color: '#3E198C',
        textAlign: 'center',
      },info:{
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
      },subinfo:{
        fontSize: 15,
        marginTop: 10,
      },  input: {
        height: 40,
        borderColor: '#3E198C',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 8,
        backgroundColor: '#E8CBF6',
      },btn: {
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
      },btntext: {
        color: '#3E198C',
        fontSize: 20,
        textAlign: 'center', 
        fontFamily: 'TeX Gyre Heros',
        fontStyle: 'normal',
        fontWeight: '700',
      }
      
  });
  

export default PremiumScreen;
