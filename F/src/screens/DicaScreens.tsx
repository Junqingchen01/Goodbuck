import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DicaScreens = () => {
  const navigation = useNavigation();
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          'https://backend-54nz.onrender.com/dica'
          , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDicas(data.dica || []);
        } else {
          console.error('Error:', response.status);
        }
      } else {
        console.error('AsyncStorage cant find token');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDicaPress = (DicaID) => {
    
    navigation.navigate('dica', { DicaID });
  };

  const goToFavorito = () => {
    navigation.navigate('FavoritoScreens');
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerbtn}>
        <TouchableOpacity style={[styles.button, styles.leftButton]}>
          <Text style={styles.buttonText}>Dica</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={goToFavorito}>
          <Text style={styles.buttonText}>Favorito</Text>
        </TouchableOpacity>
      </View>
  
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#3E198C" />
      ) : (
        <FlatList
          data={dicas}
          keyExtractor={(item) => item.DicaID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDicaPress(item.DicaID)}>
              <View style={styles.dicaContainer}>
                <Text style={styles.title}>{`${item.Title}`}</Text>
                <Text>{`Content: ${item.Content}`}</Text>
                <Text>{'------------------------'}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
  };
  
  const styles = StyleSheet.create({
    containerbtn: {
      flexDirection: 'row',
      marginHorizontal: -6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFF7',
    },
    container: {
      flex: 1,
      marginVertical: 20,
      backgroundColor: '#FFFFF7',
      paddingHorizontal: 16,
    },
    button: {
      width: 150,
      height: 57,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 50,
      borderWidth: 4,
      borderColor: '#3E198C',
    },
    leftButton: {
      backgroundColor: '#E8CBF6',
      marginRight: -2,
    },
    rightButton: {
      backgroundColor: '#FFFFF7',
      marginLeft: -2,
    },
    buttonText: {
      color: '#3E198C',
    },
    dicaContainer: {
      marginVertical: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#DDD',
      backgroundColor: '#E8CBF6',

    },
    loadingIndicator: {
      marginTop: 20,
    },title:{
      fontSize: 25,
      color: '#3E198C',
      
    },
  });
  
  export default DicaScreens;
  