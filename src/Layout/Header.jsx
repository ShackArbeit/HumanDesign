import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import style from '../CssModules/Header.module.css'


const Header = () => {
  return (
   <navbar className={style.navbar}>
   <a href='https://www.google.com.tw/?gws_rd=ssl'>
    <img src='https://funstudynestcamp.com/images/logo_text.png?v=3'
         className={style.brand}/>
   </a>
  <ul className={style.nav}>
    <li className={style.item}>
      <Link className={style.link}>首頁</Link>
    </li>
    <li className={style.item}>
      <Link className={style.link}>什麼是人類圖</Link>
    </li>
    <li className={style.item}>
      <Link className={style.link}>認識Jerome</Link>
    </li>
    <li className={style.item}>
      <Link className={style.link}>體驗回饋</Link>
    </li>
    <li className={style.item}>
      <Link className={style.link}>立即預約</Link>
    </li>
  </ul>
   </navbar>
  );
};

export default Header;
