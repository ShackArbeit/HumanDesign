import style from '../styles/SectionTitle.module.css';

export const SectionTitle = ({ children, subtitle }) => (
  <div className={style.wrap}>
    <h2>{children}</h2>
    {subtitle && <p className={style.subtitle}>{subtitle}</p>}
  </div>
);
