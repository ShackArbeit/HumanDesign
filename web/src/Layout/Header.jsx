import { Link, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import style from '../CssModules/Header.module.css';
import Swal from 'sweetalert2';
import { useAuth } from '../features/auth/AuthProvider';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
        await signOut();
        navigate('/');
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
      <Link className={style.Navlink} to="/">首頁</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="/human">什麼是人類圖</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="/jerome">認識Jerome</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="/feedback">免費音檔</Link>
    </li>
    <li className={style.Navitem}>
      <Link className={style.Navlink} to="/booking">立即預約</Link>
    </li>
    {!user && (
          <li className={style.Navitem}>
            <Link className={style.Navlink} to="/signin">
              會員登入
            </Link>
          </li>
        )}
    {user &&(
          <>
          <li className={style.Navitem}>
            <Link className={style.Navlink} to="/my-bookings">
              查看預約紀錄
            </Link>
           </li>
          <li className={style.Navitem}>
           <Link className={style.Navlink} to="/contact">
                Email 我們 !
            </Link>
          </li>
            <li className={style.Navitem}>
              <Link className={style.Navlink} to="/" onClick={(event) => {
                event.preventDefault();
                handleLogOut();
              }}>
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