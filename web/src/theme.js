import { createTheme } from '@mui/material/styles';

const FONT_SANS = "'Noto Sans TC', system-ui, sans-serif";

// Mirrors styles/tokens.css so MUI and plain CSS components look the same.
export const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 480, md: 768, lg: 1024, xl: 1280 },
  },
  palette: {
    primary: { main: '#2d4f7c', dark: '#1d3556' },
    secondary: { main: '#a8662a' },
    text: { primary: '#24292f', secondary: '#5a6470' },
  },
  typography: {
    fontFamily: FONT_SANS,
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
});
