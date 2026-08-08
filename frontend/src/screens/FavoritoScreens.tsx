/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritoScreens = () => {
  const navigation = useNavigation();
  const [favoriteDicaIDs, setFavoriteDicaIDs] = useState([]);
  const [favoriteDicas, setFavoriteDicas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavoriteDicaIDs = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const favDicaIDs = keys.filter((key) => key.startsWith('favorite_')).map((key) => key.split('_')[1]);
      setFavoriteDicaIDs(favDicaIDs);
    } catch (error) {
      console.error('Error fetching favorite Dica IDs:', error);
    }
  }, []);

  const fetchDicaDetails = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const favoriteDicaData = await Promise.all(
        favoriteDicaIDs.map(async (DicaID) => {
          const response = await fetch(`https://backend-54nz.onrender.com/dica/${DicaID}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            return { DicaID, ...data.dica };
          } else {
            console.error('Error fetching Dica details:', response.status);
            return { DicaID };
          }
        })
      );

      setFavoriteDicas(favoriteDicaData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Dica details:', error);
    }
  }, [favoriteDicaIDs]);

  useEffect(() => {
    const loadData = async () => {
      await fetchFavoriteDicaIDs();
      await fetchDicaDetails();
    };

    loadData();
  }, [fetchFavoriteDicaIDs, fetchDicaDetails]);

  const goToDica = () => {
    navigation.navigate('Dica');
  };

  const handleDicaPress = (DicaID) => {
    navigation.navigate('dica', { DicaID });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerbtn}>
        <TouchableOpacity style={[styles.button, styles.rightButton]} onPress={goToDica}>
          <Text style={styles.buttonText}>Dica</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.leftButton]}>
          <Text style={styles.buttonText}>Favorito</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#3E198C" />
      ) : favoriteDicas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/nodado.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>
            De momento não há Dicas favoritas. Adicione Dicas aos favoritos tocando no botão de favorito nas Dicas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteDicas}
          keyExtractor={(item) => item.DicaID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDicaPress(item.DicaID)}>
              <View style={styles.dicaContainer}>
                <Text style={styles.title}>{`${item.Title || 'No Title'}`}</Text>
                <Text>{`Content: ${item.Content || 'No Content'}`}</Text>
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
  },
  title: {
    fontSize: 25,
    color: '#3E198C',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: 210,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
});

export default FavoritoScreens;
