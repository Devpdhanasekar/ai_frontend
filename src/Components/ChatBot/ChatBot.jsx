import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css"; // Add styles for chatbot

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, how can I assist you?" },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Add user's message to chat
      const updatedMessages = [
        ...messages,
        { sender: "user", text: userMessage },
      ];
      setMessages(updatedMessages);

      try {
        // Prepare the payload
        const payload = {
          message: updatedMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text,
          })),
        };

        // Send the API request
        const response = await axios.post(
          "http://3.108.54.190:8080/chatbot",
          payload
        );

        // Extract the bot's response from the API response
        const botResponse = response.data.assistant;

        // Update the messages with the bot's response
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botResponse },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }

      // Clear the input field
      setUserMessage("");
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">Chatbot</div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "bot" ? "bot" : "user"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
