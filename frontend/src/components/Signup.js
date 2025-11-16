import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AuthForm.css';

const Signup = ({ userType, onSignup }) => {
  const [formData, setFormData] = useState({
    collegeName: '',
    username: '',
    email: '',
    password: '',
    location: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    try {
      let response;
      if (userType === 'college') {
        response = await axios.post('http://localhost:4000/api/auth/college/signup', {
          collegeName: formData.collegeName,
          email: formData.email,
          password: formData.password,
          location: formData.location,
        });
      } else {
        response = await axios.post('http://localhost:4000/api/auth/student/signup', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
      }

      if (response.status === 201) {
        alert(`${userType === 'college' ? 'College' : 'Student'} signed up successfully`);
        onSignup(formData); // Handle state update

        window.location.href = '/login';
      }
    } catch (error) {
        if (error.response && error.response.data.errors) {
        // Display validation errors from the backend
          setErrors(error.response.data.errors);
        } else {
          console.error('Signup Error:', error.response ? error.response.data : error.message);
          alert('Error signing up');
        }
    }
  };

  const renderFormFields = () => {
    return userType === 'college' ? (
      <>
        <input type="text" placeholder="College Name" onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })} required />
        <input type="text" placeholder="Location" onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
      </>
    ) : (
      <>
        <input type="text" placeholder="Username" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
        <input type="text" placeholder="First Name" onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
        <input type="text" placeholder="Last Name" onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
      </>
    );
  };

  return (
    <div className="auth-form">
      <h2>Sign Up as {userType === 'college' ? 'College' : 'Student'}</h2>
      <form onSubmit={handleSubmit}>
        {renderFormFields()}
        <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        <div className='password-input'>
          <input type={passwordVisible ? 'text' : 'password'} name="password" placeholder="Password" onChange={handleChange} required />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {passwordVisible ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {errors.length > 0 && (
                <div style={{ color: 'red' }}>
                    <h4>Weak Password:</h4>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
    </div>
  );
};

export default Signup;
