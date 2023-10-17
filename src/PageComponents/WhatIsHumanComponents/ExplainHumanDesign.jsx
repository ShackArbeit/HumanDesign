import style from '../../CssModules/HumanDesignDetail.module.css'
import styles from '../../CssModules/HomePage.module.css'
import { styled } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Container from 'react-bootstrap/Container';


const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));



export default function ExplainHumanDesign() {
  return (
    <Container className={style.HumanDesignWrap} fluid>
    <h1 className={style.HumanDesignMainTitle}>You Are Waht You Be !  </h1>
    <div className={styles.briefItems}>
    <div className={styles.briefImage}>
      <img src="https://picsum.photos/600/350?random=10"/>
    </div>
    <div className={styles.briefText}>
    <h2>體驗人類圖是一段轉化生命的過程</h2>
			<p>每一天日常生活的紛擾讓人分心，讓我們越來越偏離自己真正的本質。 人類圖為每個人提供了一本「人生使用說明書」，這是依照我們原始的設定， 以及各自的人生目的來編寫，讓我們得以回到原本來到這個世界上的初衷。 人類圖解釋了冥冥之中，我們身處的宇宙與各自生命的關係， 它揭露了每一個人生命獨特的模式，協助我們重新與自己真實的本質再度連結。
            </p>
            <Stack spacing={2} direction="row" margin="0 atuo">
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <ColorButton variant="contained">
        <a href='https://humandesignasia.org/' style={{textDecoration:"none",color:"white"}}>取得你的人類圖 ! </a>
        </ColorButton>
      </div>
    </Stack>
    </div>
    </div>
    <div className={styles.briefItems}>
    <div className={styles.briefText}>
    <h2>與眾不同是多麼美妙的一件事。</h2>
			<p>當你開始了解自己的獨一無二，知道自己不必像任何人， 那原本背負在身上沈重的包袱終於得以卸下。你終於可以自由活出原有的本性。 事實上，你出生時並沒有拿到一本自己的使用說明書，但是，這並不代表現在不可能， 人類圖，你的人生使用說明書，開始活出原本的自己，永遠不會太晚！
            </p>
            <Stack spacing={2} direction="row" margin="0 atuo">
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <ColorButton variant="contained">
        <Link to='/HumanDesign/booking' style={{textDecoration:"none",color:"white"}}>立即預約解析 ! </Link>
        </ColorButton>
      </div>
    </Stack>
    </div>
    <div className={styles.briefImage}>
      <img src="https://picsum.photos/600/350?random=11"/>
    </div>
    </div>
    </Container>
  );
}


