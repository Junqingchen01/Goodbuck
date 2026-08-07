import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MetasScreen = () => {
  const navigation = useNavigation();
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://backend-54nz.onrender.com/metas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMetas(data.metas);
        } else {
          console.error('Error fetching metas:', response.status);
        }
      } else {
        console.error('AsyncStorage cant find token');
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const goToDespesas = () => {
    navigation.navigate('Despesas');
  };

  const goToAddMeta = () => {
    navigation.navigate('AddMeta');
  };

  const handleMetaPress = (MetaID) => {
    navigation.navigate('meta', { MetaID });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerbtn}>
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={goToDespesas}
        >
          <Text style={styles.buttonText}>Transações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
        >
          <Text style={styles.buttonText}>Metas de Poupança</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : metas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/nodado.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>
            De momento não adicionou Metas de Poupança. Para adicionar uma Meta, toque no botão abaixo.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={metas}
          keyExtractor={(item) => item.MetaID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleMetaPress(item.MetaID)}>
              <View key={item.MetaID} style={styles.metaContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{`${item.Name}`}</Text>
                  <Text style={styles.category}>{`${item.Description}`}</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                  <Text style={styles.amount}>{`${item.CurrentContribution} / ${item.PlannedContribution}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.add}>
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={goToAddMeta}
        >
          <Text style={styles.buttonText}>Adicionar nova meta</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFFFF7',
    height: 493,
    width: 431,
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
  add: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#E8CBF6',
  },
  title: {
    fontSize: 25,
    color: 'black',
    marginLeft: 10,
  },
  category: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    borderRadius: 50,
    borderWidth: 2,
    width: 80,
    textAlign: 'center',
    backgroundColor: '#3E198C',
    borderColor: '#3E198C',
  },
  amount: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3E198C',
    padding: 5,
    width: 210,
    textAlign: 'center',
    margin: 0,
    backgroundColor: '#E8CBF6',
  },
  flatList: {
    maxHeight: 400,
    backgroundColor: '#FFFFF7',
    paddingHorizontal: 16,
    paddingVertical: 12,
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

export default MetasScreen;
