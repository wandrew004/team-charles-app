import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7B8A64', // green for buttons
      contrastText: '#FFC664', // yellow text on buttons
    },
    secondary: {
      main: '#DEE9C0', // card background
      contrastText: '#7B8A64', // card text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          padding: '0.5rem 1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#DEE9C0',
          color: '#7B8A64',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
