import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, CssBaseline } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';
import '../styling.css';
const LoginRegisterPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const navigate = useNavigate();

  const handleChangeForm = () => {
    setIsLoginForm((prev) => !prev);
  };

  const handleRegisterSuccess = () => {
    setIsLoginForm(true); // Switch to the login form after successful registration
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData?.username && userData?.userRole==='EMPLOYEE'){
      navigate('/my_shifts');
    }else if(userData?.username && userData?.userRole==='MANAGER'){
      navigate('/schedule');
    }
  });

  return (
    <div className='login-background-container'>
      <div className='blur'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CssBaseline />
          <Container maxWidth="md">
            <Paper
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '105%',
              }}
            >
              <Typography variant="h5" gutterBottom>
                {isLoginForm ? 'Login' : 'Register'}
              </Typography>
              <Grid container spacing={4}>
                {isLoginForm ? (
                  <>
                    <Grid item xs={12} md={6}>
                      <LoginForm handleChangeForm={handleChangeForm} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <img
                        src="https://api.eremedia.com/wp-content/uploads/2016/09/happy-face-workers.jpg"
                        alt="Illustration"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={6}>
                      <img
                        src="https://static.thenounproject.com/png/882184-200.png"
                        alt="Illustration"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <RegisterForm
                        handleChangeForm={handleChangeForm}
                        onRegisterSuccess={handleRegisterSuccess} // Pass the new prop to RegisterForm
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Container>
        </Box>
      </div>

    </div>

  );
};

export default LoginRegisterPage;