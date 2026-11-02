// 頁面共用外框：標題、說明文字和寬度
import style from '../styles/PageContainer.module.css';

export const PageContainer = ({ title, intro, narrow = false, children }) => (
  <div className={`${style.page} ${narrow ? style.narrow : ''}`}>
    {title && <h1 className={style.title}>{title}</h1>}
    {intro && <p className={style.intro}>{intro}</p>}
    {children}
  </div>
);
