import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreens = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://backend-54nz.onrender.com/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
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

  const deleteAllNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch('https://backend-54nz.onrender.com/notifications', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setNotifications([]);
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

  const deleteNotification = async (NotificationID) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await fetch(`https://backend-54nz.onrender.com/notifications/${NotificationID}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setNotifications((prevNotifications) => prevNotifications.filter((n) => n.NotificationID !== NotificationID));
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
    fetchNotifications();
  }, []);


  const handleDeleteAllPress = () => {
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete all notifications?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteAllNotifications(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeletePress = (NotificationID) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteNotification(NotificationID),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}> 
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationText}>No notifications here yet</Text>
      ) : (
        <FlatList
            style={{ maxHeight: 400 }}
            data={notifications}
            keyExtractor={(item) => item.NotificationID.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => (item?.NotificationID)}>
                <View style={styles.notificationItem}>
                    <View style={styles.notificationContainer}>
                    <Text style={styles.title}> {` ${item?.Title || ''}`}</Text>
                    <Text>{`${item?.Content || ''}`}</Text>
                    <Text>{`Date: ${item?.Date || ''}`}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item?.NotificationID)}>
                        <Text>X</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                </TouchableOpacity>
            )}
            />
      )}
      <TouchableOpacity
            style={[styles.deleteAllButton, { display: notifications.length > 0 ? 'flex' : 'none' }]}
            onPress={handleDeleteAllPress}>
            <Text>Delete All Notifications</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFF7',
    padding: 16,
  },
  deleteAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 57,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3E198C',
    marginLeft: 90,
    color: '#3E198C',

  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationContainer: {
    flex: 1,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  deleteButton: {
    position: 'absolute',
    top: 5, 
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#3E198C',
 
  },noNotificationText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#555', 
  },title:{
    fontSize: 25,
    color: '#3E198C',
  },
  
});

export default NotificationScreens;
