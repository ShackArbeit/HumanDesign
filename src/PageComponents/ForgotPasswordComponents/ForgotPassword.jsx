import style from '../../CssModules/AuthProcess.module.css'
import Stack from '@mui/material/Stack';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import { useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { SignInContext } from '../../ContextComponents/SignInContext';

const defaultTheme = createTheme();

 const ForgotPassword = () => {
    const {open,setOpen,email,setEmail,handleSubmitResendPassword}=useContext(SignInContext)
  return (
    <div className={style.ForgotPasswordContainer}>
    <Stack sx={{ width: '100%'}}>
    <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <CloseIcon />
            </IconButton>
          }
          sx={{fontSize:'25px'}}
        >
          請輸入你註冊時的電子信箱以利寄送你的密碼
        </Alert>
      </Collapse>
    </Stack>
    <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position:'relative',
          top:'100px'
        }}
      >
        <Typography component="h1" variant="h5" >
          忘記密碼
        </Typography>
        <Box component="form"  noValidate sx={{ mt: 1 }} onSubmit={handleSubmitResendPassword} >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="請輸入註冊時的電子信箱"
            name="email"
            autoComplete="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Box sx={{
              display:'flex'
          }}>
          <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, 
                  mb: 2,
                  fontWeight: 'bold',
                  fontSize:'20px'
              }}
          >
            送出
          </Button>
        </Box>
        </Box>
      </Box>
    </Container>
  </ThemeProvider>
    </div>
  )
}

export default ForgotPassword;