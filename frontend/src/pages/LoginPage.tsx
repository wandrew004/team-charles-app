import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import theme from '../theme';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        await checkAuth();
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3,
            position: 'relative'
          }}
        >
          <Button 
            onClick={() => navigate('/')}
            sx={{ 
              position: 'absolute',
              top: 20,
              left: 20,
              color: '#7B8A64',
              fontSize: '1.125rem'
            }}
          >
            ← back
          </Button>
          <Container maxWidth="xs">
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: '#DEE9C0',
                borderRadius: 2
              }}
            >
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  color: '#7B8A64',
                  fontWeight: 'bold',
                  mb: 4
                }}
              >
                Sign in to RecipeHub
              </Typography>
              <Box 
                component="form" 
                onSubmit={handleSubmit} 
                sx={{ 
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#7B8A64',
                      },
                      '&:hover fieldset': {
                        borderColor: '#7B8A64',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7B8A64',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7B8A64',
                      '&.Mui-focused': {
                        color: '#7B8A64',
                      },
                    },
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#7B8A64',
                      },
                      '&:hover fieldset': {
                        borderColor: '#7B8A64',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7B8A64',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7B8A64',
                      '&.Mui-focused': {
                        color: '#7B8A64',
                      },
                    },
                  }}
                />
                {error && (
                  <Typography 
                    sx={{ 
                      color: '#FF0000',
                      textAlign: 'center',
                      mt: 1
                    }}
                  >
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    bgcolor: '#7B8A64',
                    color: '#FFC664',
                    '&:hover': {
                      bgcolor: '#6A7A54',
                    },
                  }}
                >
                  Sign In
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link to="/auth/signup" style={{ textDecoration: 'none' }}>
                    <Typography 
                      sx={{ 
                        color: '#7B8A64',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Don't have an account? Sign Up
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default LoginPage; 