import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logAction from '../utils/logAction'; // Import logAction function

const ChatBox = ({ request_id }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch existing messages for the specific request
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`https://mcq-project-backend.onrender.com/api/chat/${request_id}`);
        
        // Ensure the response is an array
        const fetchedMessages = Array.isArray(response.data) ? response.data : [];
        setMessages(fetchedMessages);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };

    fetchMessages();
  }, [request_id]);

  // Send a new message
  const sendMessage = async () => {
    if (message.trim() === '') return;

    const user_id = 15; // This should be dynamically fetched based on the logged-in user
    const newMessage = { message, user_id };

    try {
      const response = await axios.post(`https://mcq-project-backend.onrender.com/api/chat/${request_id}`, newMessage);
      
      // Ensure the response data is correctly handled as an object or array
      setMessages(prevMessages => [...prevMessages, response.data]);
      setMessage('');

      // Log the action
      logAction('send', 'chat message', response.data);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.chat_message_id} className="message">
            <strong>User {msg.user_id}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
