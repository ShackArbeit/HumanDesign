// 全站頁首與導覽選單，手機版使用漢堡選單
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';
import style from '../styles/Header.module.css';

const PUBLIC_LINKS = [
  { to: '/human', label: '什麼是人類圖' },
  { to: '/jerome', label: '認識 Jerome' },
  { to: '/feedback', label: '免費音檔' },
  { to: '/booking', label: '立即預約' },
];

const MEMBER_LINKS = [
  { to: '/my-bookings', label: '我的預約' },
  { to: '/contact', label: '聯絡我們' },
];

const linkClass = ({ isActive }) => `${style.link} ${isActive ? style.active : ''}`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 換頁時自動關閉手機選單
  useEffect(() => setIsOpen(false), [pathname]);

  // 選單打開時，可以按 Esc 關閉
  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header className={style.header}>
      <div className={style.bar}>
        <Link to="/" className={style.brand}>
          <img src="/logo.svg" alt="" width="36" height="36" />
          <span>當八字遇見人類圖</span>
        </Link>
        <button
          type="button"
          className={style.menuButton}
          aria-label={isOpen ? '關閉選單' : '開啟選單'}
          aria-expanded={isOpen}
          aria-controls="main-nav"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="main-nav" aria-label="主要選單" className={isOpen ? style.navOpen : style.nav}>
          <ul>
            {PUBLIC_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
            {user ? (
              <>
                {MEMBER_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <NavLink to={to} className={linkClass}>
                      {label}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button type="button" className={style.link} onClick={handleSignOut}>
                    登出
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/signin" className={linkClass}>
                  會員登入
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
