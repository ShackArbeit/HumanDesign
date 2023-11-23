import { Link } from 'react-router-dom';
import {useState,useEffect} from 'react'


import style from '../CssModules/Header.module.css'


const Header = () => {
  
  const[isOpen,setIsOpen]=useState(false)
  useEffect(() => {
    const handleResize = () => {
      // 這裡是設定不管漢堡列是否被開啟或是關閉，當螢幕寬度大於768px時，漢堡列裡面的項目都會不顯示
      if (window.innerWidth > 768) {
        setIsOpen(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
   <header className={style.navbar}>
   <a href='https://www.google.com.tw/?gws_rd=ssl'>
    <img src='https://funstudynestcamp.com/images/logo_text.png?v=3'
         className={style.brand}/>
   </a>
  <ul className={isOpen?style.NavMenu:style.Nav}>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="">首頁</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="human">什麼是人類圖</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="Jerome">認識Jerome</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="Feedback">體驗回饋</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="booking">立即預約</Link>
    </li>
  </ul>
  <a className={style.menuToggle}
  onClick={()=>setIsOpen(!isOpen)}
  >
						<span></span>
						<span></span>
						<span></span>
					</a>
   </header>
  );
};

export default Header;
