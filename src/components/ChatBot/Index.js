// src/ChatBot.js
import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSend = async () => {
    if (userInput.trim() === '') return;

    const newMessage = { sender: 'user', text: userInput };
    setMessages([...messages, newMessage]);

    // Send user input to our proxy server
    const botResponse = await getBotResponse(userInput);
    setMessages((prevMessages) => [...prevMessages, newMessage, botResponse]);

    setUserInput('');
  };

  const getBotResponse = async (input) => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
      });

      const botMessage = response.data.botMessage;
      return { sender: 'bot', text: botMessage };
    } catch (error) {
      console.error('Error fetching response from server:', error);
      return { sender: 'bot', text: "Sorry, I couldn't process your request." };
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
