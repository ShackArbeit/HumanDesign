import style from '../../CssModules/HomePage.module.css'
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';




const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));


const BriefIntroduce = () => {
  return (
    <div className={style.briefWrap}>
    <h1 style={{marginBottom:'2rem'}}>What is Human Design ?</h1>
    <div className={style.briefItems}>
    <div className={style.briefImage}>
      <img src="https://picsum.photos/600/350?random=10"/>
    </div>
    <div className={style.briefText}>
    <h2>Jüdische Gemeinden in Deutschland: "Einfach nur Angst"</h2>
			<p>Nach den Terrorangriffen der Hamas in Israel schauen die jüdischen Gemeinden auf die Entwicklung in Nahost. Sie haben Sorge, auch in Deutschland nicht mehr sicher zu sein.
            </p>
            <Stack spacing={2} direction="row" margin="0 atuo">
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <ColorButton variant="contained">
        <Link to='human' style={{textDecoration:"none",color:"white"}}>了解更多 ! </Link>
        </ColorButton>
      </div>
    </Stack>
    </div>
    </div>
    <div className={style.briefItems}>
    <div className={style.briefText}>
    <h2>Jüdische Gemeinden in Deutschland: "Einfach nur Angst"</h2>
			<p>Nach den Terrorangriffen der Hamas in Israel schauen die jüdischen Gemeinden auf die Entwicklung in Nahost. Sie haben Sorge, auch in Deutschland nicht mehr sicher zu sein.
            </p>
            <Stack spacing={2} direction="row" margin="0 atuo">
            <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
        <ColorButton variant="contained">
        <Link to='human' style={{textDecoration:"none",color:"white"}}>了解更多 ! </Link>
        </ColorButton>
      </div>
    </Stack>
    </div>
    <div className={style.briefImage}>
      <img src="https://picsum.photos/600/350?random=11"/>
    </div>
    </div>
    </div>
  )
}

export default BriefIntroduce