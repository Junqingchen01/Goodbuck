import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DicaDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { DicaID } = route.params;
  const [dicaDetail, setDicaDetail] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDicaDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(
          `https://backend-54nz.onrender.com/dica/${DicaID}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDicaDetail(data);

          // 在这里检查是否为收藏项
          const isFav = await AsyncStorage.getItem(`favorite_${DicaID}`);
          setIsFavorite(!!isFav);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDicaDetail();
  }, [DicaID]);

  const handleToggleFavorite = async () => {
    try {
      setIsFavorite((prev) => !prev);

      const favoriteKey = `favorite_${DicaID}`;
      const isFav = await AsyncStorage.getItem(favoriteKey);

      if (isFav) {
        await AsyncStorage.removeItem(favoriteKey);
      } else {
        await AsyncStorage.setItem(favoriteKey, JSON.stringify(dicaDetail));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!dicaDetail) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>{`DicaID: ${dicaDetail.dica.DicaID}`}</Text>
      <Text>{`Title: ${dicaDetail.dica.Title}`}</Text>
      <Text>{`Content: ${dicaDetail.dica.Content}`}</Text>

      <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
        <Text style={styles.buttonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
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
  favoriteButton: {
    width: 200,
    height: 57,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3E198C',
    marginTop: 20,
  },
  buttonText: {
    color: '#3E198C',
    fontSize: 16,
  },
});

export default DicaDetail;
