import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! 👋 How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  // FAQ database with keywords and responses
  const faqDatabase = [
    {
      keywords: ['register', 'registration', 'sign up', 'signup', 'how to register'],
      response: 'To register for an event:\n1. Browse events on the Home page or Events page\n2. Click on an event to view details\n3. Click the "Register" button\n4. You must be logged in as a student to register!'
    },
    {
      keywords: ['login', 'log in', 'sign in', 'account'],
      response: 'To login:\n1. Click "Login" in the header\n2. Enter your email and password\n3. Click "Login"\n\nDemo accounts:\n- Student: john@student.com (Password: Student@123)\n- College: admin@mit.edu (Password: College@123)'
    },
    {
      keywords: ['events', 'find events', 'browse events', 'view events'],
      response: 'You can find events in several ways:\n1. Home page - View trending events\n2. Student Dashboard - See personalized recommendations\n3. Events page - Browse all available events\n4. Use filters to search by category or location'
    },
    {
      keywords: ['create event', 'add event', 'post event', 'college event'],
      response: 'To create an event (Colleges only):\n1. Login as a college\n2. Go to College Dashboard\n3. Click "Create Event"\n4. Fill in event details\n5. Choose public or private visibility\n6. Upload an image (optional)\n7. Submit!'
    },
    {
      keywords: ['recommendation', 'recommended', 'suggestions', 'personalized'],
      response: 'Our AI recommends events based on your interests!\n1. Login as a student\n2. Go to Student Dashboard\n3. Click "Update Interests"\n4. Select your interests\n5. View personalized recommendations!'
    },
    {
      keywords: ['trending', 'popular', 'top events'],
      response: 'Trending events are shown on the Home page! They are ranked by:\n- View count (30%)\n- Average rating (70%)\n\nThe most popular events appear first.'
    },
    {
      keywords: ['rate', 'rating', 'review', 'feedback'],
      response: 'To rate an event:\n1. Click on an event to view details\n2. Scroll to "Event Ratings" section\n3. Click "Rate this Event"\n4. Select 1-5 stars\n5. Add an optional review\n6. Submit!\n\nNote: You can only rate each event once.'
    },
    {
      keywords: ['interests', 'categories', 'preferences'],
      response: 'We have 13 interest categories:\nTechnology, Sports, Arts, Music, Business, Science, Literature, Gaming, Social, Environment, Health, Education, Other\n\nUpdate your interests in Student Dashboard to get better recommendations!'
    },
    {
      keywords: ['dashboard', 'profile', 'my events'],
      response: 'Student Dashboard features:\n- View your profile\n- See registered events\n- Get personalized recommendations\n- Update interests\n\nCollege Dashboard features:\n- Create new events\n- Manage your events\n- View event analytics'
    },
    {
      keywords: ['private', 'public', 'visibility', 'invitation'],
      response: 'Events can be:\n- Public: Anyone can see and register\n- Private: Invitation-only, not shown in public lists\n\nColleges can choose when creating an event!'
    },
    {
      keywords: ['contact', 'support', 'help', 'email', 'message'],
      response: 'Need more help? I can redirect you to our Contact page!\n\nClick the button below:',
      action: 'contact'
    },
    {
      keywords: ['hello', 'hi', 'hey', 'greetings'],
      response: 'Hello! 👋 I\'m your Events Aggregator assistant. Ask me anything about:\n- Registering for events\n- Creating events\n- Finding recommendations\n- Using the platform\n\nWhat would you like to know?'
    },
    {
      keywords: ['thank', 'thanks', 'thank you'],
      response: 'You\'re welcome! 😊 Is there anything else I can help you with?'
    },
    {
      keywords: ['bye', 'goodbye', 'exit', 'close'],
      response: 'Goodbye! Feel free to chat with me anytime. Have a great day! 👋',
      action: 'close'
    }
  ];

  const findResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Check each FAQ entry
    for (const faq of faqDatabase) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq;
      }
    }

    // Default response if no match
    return {
      response: 'I\'m not sure about that. Here are some things I can help with:\n\n- Event registration\n- Account login\n- Finding events\n- Creating events\n- Recommendations\n- Ratings and reviews\n\nYou can also contact our support team!',
      action: 'contact'
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    // Find bot response
    const matchedFaq = findResponse(input);

    setTimeout(() => {
      const botMessage = { type: 'bot', text: matchedFaq.response };
      setMessages(prev => [...prev, botMessage]);

      // Handle actions
      if (matchedFaq.action === 'contact') {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: 'action',
            text: 'Go to Contact Page',
            onClick: () => {
              navigate('/contact-us');
              setIsOpen(false);
            }
          }]);
        }, 500);
      } else if (matchedFaq.action === 'close') {
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      }
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const quickQuestions = [
    'How to register?',
    'Find events',
    'Create event',
    'Get recommendations',
    'Contact support'
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
        <span className="chat-icon">💬</span>
        <span className="chat-text">Need Help?</span>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-content">
              <span className="bot-avatar">🤖</span>
              <div className="header-text">
                <h3>Events Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.type === 'bot' && <span className="bot-icon">🤖</span>}
                {msg.type === 'action' ? (
                  <button className="action-btn" onClick={msg.onClick}>
                    {msg.text} →
                  </button>
                ) : (
                  <div className="message-text">{msg.text}</div>
                )}
                {msg.type === 'user' && <span className="user-icon">👤</span>}
              </div>
            ))}
          </div>

          {messages.length <= 1 && (
            <div className="quick-questions">
              <p>Quick questions:</p>
              <div className="quick-buttons">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleQuickQuestion(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
