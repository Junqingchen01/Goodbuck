import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DespesasScreen = () => {
  const navigation = useNavigation();
  const [despesas, setDespesas] = useState([]);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          'https://backend-54nz.onrender.com/despesas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setDespesas(data.user.Despesas);
        } else {
          console.error('Erro:', response.status);
          navigation.navigate('Login');
        }
      } else {
        console.error('AsyncStorage cant find token');
      }
    } catch (error) {
      console.error('erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          'https://backend-54nz.onrender.com/perfil/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
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

  useEffect(() => {
    fetchData();
    fetchUserData();
  }, []);

  const goToMetas = () => {
    navigation.navigate('Metas');
  };

  const goToAddDespesa = () => {
    navigation.navigate('AddDespesa');
  };

  const handleDespesaPress = (DespesaID) => {
    navigation.navigate('despesa', { DespesaID });
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerbtn}>
        <TouchableOpacity style={[styles.button, styles.leftButton]}>
          <Text style={styles.buttonText}>Transações</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={goToMetas}
        >
          <Text style={styles.buttonText}>Metas de Poupança</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading...</Text>
      ) : despesas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={require('../assets/nodado.png')} style={styles.emptyImage} />
          <Text style={styles.emptyText}>
            De momento não adicionou Despesas. Para adicionar uma Despesa toque no botão abaixo.
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={despesas}
          keyExtractor={(item) => item.DespesaID.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDespesaPress(item.DespesaID)}>
              <View style={styles.metaContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{`${item.Description}`}</Text>
                    <Text style={styles.category}>{` ${item.Category}`}</Text>
                    <Text style={{ marginLeft: 10 }}>{`Date: ${item.Date}`}</Text>
                  </View>
                  <View style={{ marginTop: 15 }}>
                    <Text style={styles.amount}>{`Amount: ${item.Amount}  ${userData.CurrencyUnit}`}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.add}>
        <TouchableOpacity
          style={[styles.button, styles.addbtn]}
          onPress={goToAddDespesa}
        >
          <Text style={styles.buttonText}>Adicionar nova despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.reflashbtn]}
          onPress={handleRefresh}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerbtn: {
    flexDirection: 'row',
    marginHorizontal: -6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFF7',
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
  metaContainer: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    color: 'white',
    backgroundColor: '#E8CBF6',
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
  title: {
    fontSize: 30,
    color: 'black',
    marginLeft: 10,
  },
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addbtn: {
    flex: 1,
    marginRight: 5,
    backgroundColor: '#E8CBF6',
  },
  reflashbtn: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#FFFFF7',
  },
});

export default DespesasScreen;
