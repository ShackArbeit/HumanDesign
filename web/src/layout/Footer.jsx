import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import style from '../styles/Footer.module.css';

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/search/top?q=%E4%BA%BA%E9%A1%9E%E5%9C%96%E7%9C%8B%E4%B8%96%E7%95%8C%20jerome%27s%20human%20design',
    label: 'Facebook',
    Icon: FacebookIcon,
  },
  {
    href: 'https://www.instagram.com/jerome.hdesign/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
];

const Footer = () => (
  <footer className={style.footer}>
    <div className={style.columns}>
      <section>
        <h2 className={style.heading}>當八字遇見人類圖</h2>
        <ul className={style.social}>
          {SOCIAL_LINKS.map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                <Icon aria-hidden="true" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className={style.heading}>預約須知</h2>
        <p>
          請先點選預約系統，選取您想要的日期、時間及分析種類。預約成功後請依照匯款指示匯款，當我們收到您的匯款後會寄發預約成功通知信給您並同時給您線上分析工具。
        </p>
      </section>
      <section>
        <h2 className={style.heading}>營業時間</h2>
        <p>
          我們的營業時間都放在預約系統內，請您成功預約後勿隨意取消，七天前取消可全額退款，三日前取消酌退百分之五十，預約開始前 1 天內不可取消。
        </p>
      </section>
    </div>
    <div className={style.bottom}>
      <p>內容僅供自我探索參考，不構成醫療、心理或財務建議。</p>
      <p>Copyright © 2023 當八字遇見人類圖 Jerome HumanDesign 保留所有權利</p>
    </div>
  </footer>
);

export default Footer;
