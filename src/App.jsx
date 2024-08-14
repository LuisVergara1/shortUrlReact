import URLManager from './components/UrlManager';
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'

const theme = createTheme({
  // Define your theme settings here
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
    <div className="App">
      <header className="App-header">
        <h1>LinkSlice</h1>
        <Routes>
          <Route path="/" element={<URLManager/>}/>
          <Route path="/url_not_found" element={<URLManager />} />
        </Routes>        
      </header>
    </div>
    </Router>
    </ThemeProvider>
  );
  
}

export default App
