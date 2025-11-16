import React, { useEffect, useState } from 'react';

const WebSocketComponent = () => {
    const [messages, setMessages] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState('Connecting...');

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000'); // Replace with your WebSocket URL

        socket.onopen = () => {
            setConnectionStatus('Connected');
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Error connecting');
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            setConnectionStatus('Disconnected');
        };

        return () => {
            socket.close(); // Clean up on component unmount
        };
    }, []);

    return (
        <div>
            <h2>WebSocket Example</h2>
            <p>Status: {connectionStatus}</p>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default WebSocketComponent;
