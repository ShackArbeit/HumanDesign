import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import {Link} from 'react-router-dom'
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
import {useContext} from 'react'
import { SingUpContext } from '../../ContextComponents/SignUpContext';

const defaultTheme = createTheme();

export default function SignUp() {
   const{
    open,
    setOpen,
    handleSubmit,
    passwordPattern,
    rememberMe,
    setRememberMe
  }=useContext(SingUpContext)

  return (
    <div className={style.signUpContainer}>
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
          註冊會員可查閱訂閱紀錄 !
        </Alert>
      </Collapse>
    </Stack>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            marginBottom:8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" >
            註冊
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
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密碼須包含至少一大寫及特殊符號及八位元"
              type="password"
              id="password"
              autoComplete="current-password"
              InputProps={{
                inputProps: {
                  pattern: passwordPattern,
                },
              }}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="ConfirmPassword"
                label="密碼須包含至少一大寫及特殊符號及八位元"
                type="password"
                id="password2"
                InputProps={{
                  inputProps: {
                    pattern: passwordPattern,
                  },
                }}
           />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              onChange={() => setRememberMe(!rememberMe)} 
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
                    mr:2,
                    fontWeight: 'bold',
                    fontSize:'20px'
                }}
            >
              註冊
            </Button>
            <Button
                type="reset"
                fullWidth
                variant="contained"
                sx={{ mt: 3,
                     mb: 2,
                     fontWeight: 'bold',
                     fontSize:'20px'}}
          >
            重新輸入
          </Button>
          </Box>
            <Grid container sx={{display:'flex',flexDirection:"column"}}>
            <Grid item xs sx={{marginRight:'40px'}}>
                <Link to='/HumanDesign/notAuthBooking' variant="body2"
                sx={{textDecoration:'none',color:'red',fontSize:'18px'}}
                >
                    不加入會員直接預約
                </Link>
            </Grid>
            <Grid item>
                <Link to='/HumanDesign/signin' variant="body2"
                sx={{textDecoration:'none',fontSize:'18px'}}
                >
                {"已有帳號 ? 點擊登入 !"}
                </Link>
            </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  );
};             
