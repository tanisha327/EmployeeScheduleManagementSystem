import React, { useState } from 'react';
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField,Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URLS } from '../apiConfig';

const RegisterForm = ({ handleChangeForm, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationNumber, setOrganizationNumber] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationNumber: '',
  });
  const navigate = useNavigate();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      organizationNumber: '',
    };

    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (!organizationNumber) {
        newErrors.organizationNumber = 'Organization number is required';
        valid = false;
    } else if (organizationNumber && !/^\d+$/.test(organizationNumber)) {
      newErrors.organizationNumber = 'Organization number must contain only numeric characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      
      try {
        if (role !== undefined) {
          const response = await axios.post(API_URLS.signup, {
            name: name,
            username: email,
            password: password,
            organizationNumber: organizationNumber,
            userRole: role
          },{headers:{
              "Access-Control-Allow-Origin":"*"
          }});
  
          const responseData = response.data;
          if (responseData.id) {
            // Assuming the "id" field is present in the response data
            localStorage.setItem('userData', JSON.stringify(responseData));
            if(responseData.userRole === "EMPLOYEE"){
              onRegisterSuccess();
            }else if(responseData.userRole === "MANAGER"){
              onRegisterSuccess();
            } else{
              alert("undefined role");
            }

          } else {
            // Handle registration failed
            alert('Registration failed.');
          }
        } else {
          // Handle role not defined
          alert('Role is not defined.');
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

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
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
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Organization Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={organizationNumber}
            onChange={(e) => setOrganizationNumber(e.target.value)}
            error={!!errors.organizationNumber}
            helperText={errors.organizationNumber}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Register
      </Button>
      <p>
        Already have an account?{' '}
        <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleChangeForm}>
          Login
        </span>
      </p>
    </form>
  );
};

export default RegisterForm;