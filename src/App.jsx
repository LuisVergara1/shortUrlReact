import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import URLManager from './components/UrlManager';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff7b9e', contrastText: '#160a17' },
    error: { main: '#ff8296' },
    background: { default: '#0a1020', paper: '#151e34' },
    text: { primary: '#f7f8ff', secondary: '#b8c2d9' },
    divider: '#ffffff20',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '1px solid #38445f',
          borderRadius: 20,
          backgroundImage: 'none',
          boxShadow: '0 24px 100px #030611b0',
        },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<URLManager />} />
          <Route path="/url_not_found" element={<URLManager />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
