import {useState} from 'react'
import emailjs from '@emailjs/browser';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider,createTheme } from '@mui/material/styles';
import style from '../../CssModules/AuthProcess.module.css';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';



const defaultTheme = createTheme();

const EmailJormen = () => {
    const negative=useNavigate()
    const[name,setName]=useState('')
    const[email,setEmail]=useState('')
    const[message,setMessage]=useState('')
    const handleSubmit=(e)=>{
        e.preventDefault();
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
        const templateId= import.meta.env.VITE_EMAILJS_TEMPLATE_ID
        const publicKey= import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        const templateParams={
            from_name:name,
            from_email:email,
            to_name:'Shack Lin',
            message:message
        }
        try{
          emailjs.send(serviceId,templateId,templateParams,publicKey)
          .then(()=>{
              setName('')
              setEmail('')
              setMessage('')
              Swal.fire({
                title: '收到你的回饋',
                text: `我們已收到你的回饋，將儘速回復你 !`,
                icon: 'success',
                confirmButtonText: '返回首頁'
              })
              negative('/')
          })
          .catch(()=>{
            Swal.fire({ title: '送出失敗，請稍後再試', icon: 'error' })
        })
        }catch{
          Swal.fire({ title: '送出失敗，請稍後再試', icon: 'error' })
        }
    }
  return (
    <div className={style.signInContainer}>
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            top:'4rem'
          }}
        >
          <Typography component="h1" variant="h3" >
              意見回饋 
          </Typography>
          <Box component="form"  noValidate sx={{ mt: 1 }}  onSubmit={handleSubmit}
                
          >
          <TextField
                margin="normal"
                required
                fullWidth
                name="Name"
                label="你的姓名"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="current-password"
                />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="你的電子信箱"
               name="email"
              autoComplete="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <textarea
            cols='100'
            rows='10'
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            style={{
                 width:'100%',
                 maxWidth:'500px'
            }}
            >
            </textarea>
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
                提交回饋
            </Button>
          </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
  )
}

export default EmailJormen
