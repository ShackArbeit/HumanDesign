import { Link, useNavigate } from 'react-router-dom';
import {useState,useEffect,useContext} from 'react';
import style from '../CssModules/Header.module.css'
import { SignInContext } from '../ContextComponents/SignInContext';
import Swal from 'sweetalert2';



const Header = () => {
  
  const[isOpen,setIsOpen]=useState(false)
  const {isLoggin,setIsLoggin}= useContext(SignInContext)
  const nevigate=useNavigate()

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
  const handleLogOut=()=>{
    Swal.fire({
      title: '登出後將會到首頁，確定要登出嗎 !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggin');
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('remeberMePassword');
        nevigate('/HumanDesign')
        setIsLoggin(false)
        console.log('已經成功登出了!')
      }
    });
  }
 
 
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
    {!isLoggin && (
          <li className={style.Navitem}>
            <Link className={style.Navlink} to="signup">
              註冊 & 預約
            </Link>
          </li>
        )}
    {isLoggin &&(
          <>
            <li className={style.Navitem}>
              <Link className={style.Navlink} 
              onClick={handleLogOut}
              >
                登出
              </Link>
            </li>
            <li className={style.Navitem}>
              <Link className={style.Navlink} to="/HumanDesign/bookingAfterSignIn/checkBooking">
                查看預約紀錄
              </Link>
            </li>
          </>
        )}
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
