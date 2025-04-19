import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { Button, TextField, Card, Typography } from '@mui/material';
import theme from '../theme';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      login(data.message); // Store the success message as token for now
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password');
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md w-full p-8">
            <div className="text-center mb-8">
              <Typography variant="h4" component="h2" className="text-[#7B8A64] font-bold">
                Sign in to your account
              </Typography>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Typography color="error" className="text-center">
                  {error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="outlined"
                className="bg-white"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                className="bg-white"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="!text-lg py-3"
              >
                Sign in
              </Button>
            </form>
          </Card>
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default LoginPage; 