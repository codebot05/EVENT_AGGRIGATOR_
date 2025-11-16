import React from 'react';
import { createRoot } from 'react-dom/client'; // Make sure to import from 'react-dom/client'
import App from './App';
import './index.css';

const container = document.getElementById('root'); // Get the root element
const root = createRoot(container); // Create a root
root.render(<App />); // Render the App
