import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { VictoryPie } from 'victory-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreens = () => {
  const [categoryTotals, setCategoryTotals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(
          'https://backend-54nz.onrender.com/dashboard/amount',
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
          const coloredCategories = data.categoryTotals.map((category, index) => ({
            ...category,
            color: ['#FF5733', '#33FF57', '#5733FF', '#FFFF33', '#33FFFF'][index],
          }));
          setCategoryTotals(coloredCategories);
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
  };

  // useFocusEffect will run every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const calculateTotalAmount = () => {
    return categoryTotals.reduce((total, category) => total + parseFloat(category.TotalAmountByCategory), 0);
  };

  const calculatePercentage = (amount) => {
    return (amount / calculateTotalAmount()) * 100;
  };

  return (
<ScrollView contentContainerStyle={styles.scrollContainer}>
  <View style={styles.container}>
    {loading ? (
      <Text>Loading...</Text>
    ) : categoryTotals.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Image source={require('../assets/nodado.png')} style={styles.emptyImage} />
        <Text style={styles.emptyText}>
          De momento não há dados disponíveis. Por favor, adicione algumas transações primeiro.
        </Text>
      </View>
    ) : (
      <View style={styles.containerimg}>
        <VictoryPie
          data={categoryTotals.map(category => ({
            x: ` ${category.Category}\n$${category.TotalAmountByCategory}`,
            y: parseFloat(category.TotalAmountByCategory),
            color: category.color,
          }))}
          colorScale={categoryTotals.map(category => category.color)}
          innerRadius={70}
          labels={({ datum }) => `${datum.x}\n(${calculatePercentage(datum.y).toFixed(2)}%)`}
        />
        <Text style={styles.totalAmount}>Total: ${calculateTotalAmount().toFixed(2)}</Text>
      </View>
    )}
    <View style={styles.labelContainer}>
      {categoryTotals.map((category, index) => (
        <View key={index} style={styles.labelBoxContainer}>
          <View style={[styles.labelBox, { backgroundColor: category.color }]}>
            <Text style={styles.labelText}>{calculatePercentage(parseFloat(category.TotalAmountByCategory)).toFixed(2)}%</Text>
          </View>
          <View style={[styles.labelBox, styles.largeLabelBox, { backgroundColor: category.color }]}>
            <Text style={styles.labelText}>{`${category.Category}\n$${category.TotalAmountByCategory}`}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
</ScrollView>

  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalAmount: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    top: '60%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  labelContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  labelBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  labelBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    width: '30%',
    margin: 5,
  },
  largeLabelBox: {
    width: '65%',
  },
  labelText: {
    fontSize: 12,
    marginTop: 5,
    color: 'white',
  },
  containerimg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
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

export default DashboardScreens;