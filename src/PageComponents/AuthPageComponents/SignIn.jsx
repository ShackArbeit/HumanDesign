import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import style from '../../CssModules/AuthProcess.module.css'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useContext } from 'react';
import { SignInContext } from '../../ContextComponents/SignInContext';


const defaultTheme = createTheme();

export default function SignIn() {
    const {
      open,setOpen,passwordPattern,handleSubmit,
      email,setEmail,password,setPassword,StoragePassword,StorageEmail,
    }=useContext(SignInContext)
    
  return (
    <div className={style.signInContainer}>
    <Stack sx={{ width: '100%',marginBottom:'7rem'}}>
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
          請直接登入 !
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
          }}
        >
          <Typography component="h1" variant="h5" >
            登入
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}  onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="請輸入有效的電子信箱"
              name="email"
              autoComplete="email"
              value={email || StorageEmail} 
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              // placeholder={StorageEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼須包含至少一大寫及特殊符號及八位元"
              type="password"
              id="password"
              // placeholder={StoragePassword}
              value={password || StoragePassword}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputProps={{
                inputProps: {
                  pattern: passwordPattern,
                },
              }}
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
              登入
            </Button>
          </Box>
            <Grid container sx={{display:'flex',flexDirection:"column"}}>
              <Grid item xs>
                <Link to='resendPassword' variant="body2"
                sx={{textDecoration:'none',fontSize:'18px'}}
                >
                  忘記密碼?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
}