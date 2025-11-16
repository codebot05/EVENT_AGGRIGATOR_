import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InterestSelector.css';

const InterestSelector = ({ onSave, onSkip }) => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentInterests, setCurrentInterests] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchCurrentInterests();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/interests/categories');
      setInterests(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCurrentInterests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        'http://localhost:4000/api/student/interests',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentInterests(response.data.interests);
      setSelectedInterests(response.data.interests);
    } catch (error) {
      console.error('Error fetching current interests:', error);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:4000/api/student/interests',
        { interests: selectedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Interests saved successfully!');
      if (onSave) onSave(selectedInterests);
    } catch (error) {
      console.error('Error saving interests:', error);
      alert('Failed to save interests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interest-selector">
      <h2>Select Your Interests</h2>
      <p>Choose topics you're interested in to get personalized event recommendations</p>
      
      <div className="interest-grid">
        {interests.map(interest => (
          <label key={interest} className={`interest-item ${selectedInterests.includes(interest) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={selectedInterests.includes(interest)}
              onChange={() => toggleInterest(interest)}
            />
            <span>{interest}</span>
          </label>
        ))}
      </div>
      
      <div className="interest-actions">
        <button 
          onClick={handleSave} 
          disabled={loading || selectedInterests.length === 0}
          className="save-button"
        >
          {loading ? 'Saving...' : 'Save Interests'}
        </button>
        {onSkip && (
          <button onClick={onSkip} className="skip-button">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
};

export default InterestSelector;
