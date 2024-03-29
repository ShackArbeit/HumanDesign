import { Link, useNavigate} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import style from '../CssModules/Header.module.css';
import { SignInContext } from '../ContextComponents/SignInContext';
import Swal from 'sweetalert2';
import { DateTimeContext } from '../ContextComponents/DataTimeContext';



const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggin, setIsLoggin } = useContext(SignInContext);
  const { handleResetBooking } = useContext(DateTimeContext);
  const navigate = useNavigate();
  const StorageEmail=localStorage.getItem('rememberedEmail')
  console.log(StorageEmail)
  // useEffect(() => {
  //   const handleUnload = (event) => {
  //     if (isLoggin) {
  //       event.preventDefault();
  //       const confirmationMessage = '確定要離開嗎？請先登出會員。';
  //       event.returnValue = confirmationMessage; 
  //       return confirmationMessage; 
  //     }
  //   };
  //   window.addEventListener('beforeunload', handleUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleUnload);
  //   };
  // }, [isLoggin]);

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
            body:JSON.stringify({StorageEmail}),
          });
          const responseData = await response.json();
          console.log(responseData);
          if (responseData.success) {
            setIsLoggin(false);
            handleResetBooking();
            navigate('/HumanDesign');
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
    <img src='https://static.wixstatic.com/media/f0f6ca_1b73c7f2cf5d4066b5ad6ad5358381c7~mv2.png/v1/fill/w_559,h_204,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/hello%20taiwan%20logo.png'
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
      <Link className={style.Navlink} to="Feedback">免費音檔</Link>
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