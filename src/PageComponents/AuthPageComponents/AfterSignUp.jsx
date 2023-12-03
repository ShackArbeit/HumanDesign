import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import style from '../../CssModules/AuthProcess.module.css'
import { SingUpContext } from '../../ContextComponents/SignUpContext';
import { useContext } from 'react';
import {Link} from 'react-router-dom'

export default function AfterSignUp() {
  const {emailValue}=useContext(SingUpContext)
  return (
    <div className={style.afterSignUpContainer}>
    <Card sx={{ maxWidth: 345,margin:'0 auto'}}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image="https://picsum.photos/200/300"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          親愛的 {emailValue} 歡迎光臨 !
        </Typography>
        <Typography variant="body2" color="text.secondary">
          謝謝您註冊成為 Jeormen's 的會員，請直接點擊下方按鈕進行
          登入 !
        </Typography>
      </CardContent>
      <CardActions >
        <div style={{margin:'0 auto'}}>
        <Link to='/HumanDesign/signin'>
        <Button size="small" variant="contained"
        sx={{
          marginRight:'1.5rem',
          '&:hover': {
            border:'2px solid #f9d11f;',
            color:'black',
            backgroundColor:'#fff',
            fontWeight:700
          }
        }}
        >登入</Button>
        </Link>
        <Link to='/HumanDesign'>
        <Button size="small" variant="contained"
        sx={{
          '&:hover': {
            border:'2px solid #f9d11f;',
            color:'black',
            backgroundColor:'#fff',
            fontWeight:700
          }
        }}
        >回首頁</Button>
        </Link>
        </div>
      </CardActions>
    </Card>
    </div>
  );
}
