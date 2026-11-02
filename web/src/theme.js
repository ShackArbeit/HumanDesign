// MUI 主題，顏色和斷點與 styles/tokens.css 保持一致
import { createTheme } from '@mui/material/styles';

const FONT_SANS = "'Noto Sans TC', system-ui, sans-serif";

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
