import React, { useState, useRef } from 'react';
import { View, TextInput, Image, TouchableOpacity, FlatList, Text, StyleSheet } from 'react-native';
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import axios from 'axios';

const ChatBotScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');

    try {
      
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: inputText,
          max_tokens: 50,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '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', 
          },
        }
      );

      
      const botResponse = response.data.choices[0].text;
      setMessages([...messages, { text: botResponse, sender: 'bot' }]);

      
      flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.messageContainer, item.sender === 'user' && styles.userMessageContainer]}>
      <Text style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>{item.text}</Text>
      {item.sender === 'user' && index === messages.length - 1 && (
        <Image
          source={require('../assets/chat_inativ.png')}
          style={styles.userImage}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        
        <TouchableOpacity onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 235, 51, 0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#3E198C',
    borderRadius: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 4,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#FFFFF7',
    padding: 8,
    borderRadius: 8,
    borderColor: '#3E198C',
    borderWidth: 1,
    fontFamily: 'Fraunces-Bold',
  },
  botMessage: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    borderColor: '#3E198C',
    borderWidth: 1,
    fontFamily: 'Fraunces-Bold',
    marginRight: 8,
  },
  userImage: {
    width: 30,
    height: 30,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  sendButtonText: {
    color: '#3E198C',
    fontSize: 16,
  },
});

export default ChatBotScreen;