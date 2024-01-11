import { Link, useNavigate } from 'react-router-dom';
import {useState,useEffect,useContext} from 'react';
import style from '../CssModules/Header.module.css'
import { SignInContext } from '../ContextComponents/SignInContext';
import Swal from 'sweetalert2';
import { DateTimeContext } from '../ContextComponents/DataTimeContext';


const Header = () => {
  
  const[isOpen,setIsOpen]=useState(false)
  const{isLoggin,setIsLoggin}= useContext(SignInContext)
  const { handleResetBooking}=useContext(DateTimeContext)
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
 
  const handleLogOut = async () => {
    Swal.fire({
      title: '登出後將會到首頁，確定要登出嗎 !',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確認',
      cancelButtonText: '取消',
    }).then(async (result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('isLoggin');
        try {
          const response = await fetch('http://localhost:8000/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const responseData = await response.json();
          console.log(responseData);
          if (responseData.success) {
            setIsLoggin(false);
            handleResetBooking()
            nevigate('/HumanDesign');
            console.log('已經成功登出了!');
          } else {
            console.log('登出失敗:', responseData.message);
          }
        } catch (error) { 
          console.error('登出請求失敗:', error);
        }
      }
    });
  };

 
  return (
   <header className={style.navbar}>
   <a href='https://www.google.com.tw/?gws_rd=ssl'>
    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Major_League_Baseball_logo.svg/1200px-Major_League_Baseball_logo.svg.png'
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
            <Link className={style.Navlink} to="/HumanDesign/bookingAfterSignIn/checkBooking">
              查看預約紀錄
            </Link>
           </li>
          <li className={style.Navitem}>
           <Link className={style.Navlink} to="emailUs">
                Email 我們 !
            </Link>
          </li>
          <li className={style.Navitem}>
           <Link className={style.Navlink} to="/HumanDesign/bookingAfterSignIn/reBooking">
             再次預約 !
             </Link>
          </li>
            <li className={style.Navitem}>
              <Link className={style.Navlink} 
              onClick={handleLogOut}
              >
                登出
              </Link>
            </li>
         
          </>
        )}
  </ul>
  <a className={`${style.menuToggle} ${isOpen ? style.clicked : ''}`}
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
