// External Dependencies
import {
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { useState } from 'react';

// Local Dependencies
import Game from './Game';

// Local Variables
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Game
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </ThemeProvider>
  );
}

export default App;
