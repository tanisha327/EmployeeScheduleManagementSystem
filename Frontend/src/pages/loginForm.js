import React, { useState } from 'react';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../apiConfig';

const LoginForm = ({ handleChangeForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email is not valid';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Send a POST request to the API endpoint
        const response = await axios.post(API_URLS.login, {
          "username": email,
          "password": password,
        },{headers
        :{  
          "Access-Control-Allow-Origin":"*"
        }});

        const responseData = response.data;

        if (Object.keys(responseData).length !== 0) {
        // The response data is not empty, assuming login was successful
        const { userRole } = responseData;
        localStorage.setItem('userData', JSON.stringify(responseData));
        if (userRole === 'EMPLOYEE') {
          navigate('/my_shifts');
        } else if(userRole === 'MANAGER'){
          navigate("/schedule");
        }else {
          // Handle login failed or unauthorized user role
          alert('Login failed. Please check your credentials.');
        }
      } else {
        // Handle login failed (empty response)
        alert('Login failed. Please check your credentials.');
      }
     } catch (error) {
      // Handle API error or network issues
      console.error('Error occurred while calling the API:', error);
      alert('An error occurred. Please try again later.');
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
      />
      <TextField
        label="Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
      <p>
        Don't have an account?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleChangeForm}>
          Register
        </span>
      </p>
    </form>
  );
};

export default LoginForm;