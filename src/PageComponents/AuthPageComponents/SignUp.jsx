import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link }from 'react-router-dom'
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
import {useNavigate} from  'react-router-dom'



const defaultTheme = createTheme();

export default function SignUp() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [open, setOpen] = React.useState(true);
    const negative=useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');
        const confirmPassword = data.get('ConfirmPassword');
        if(email===''||password===''||confirmPassword===''){
            alert('請輸入信箱或密碼');
            return ;
        }
      // 要求 Email 要符合特殊的格式判斷
      if(!emailRegex.test(email)){
        alert('電子信箱格式不符合要求，請重新輸入。')
        return 
      }
      // 要求密碼要符合特殊的格式的判斷
        if (!passwordPattern.test(password &&confirmPassword)) {
          alert('密碼格式不符合要求，請重新輸入。');
          return;
      }

        if (password !== confirmPassword) {
          alert('密碼和確認密碼不相符，請重新輸入。');
          return;
        }
        else{
            negative('/HumanDesign/signinAfterAuth')
            console.log({email,password,});
        }
      };

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
            marginTop: 8,
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
              <Grid item xs>
                <Link href="#" variant="body2"
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