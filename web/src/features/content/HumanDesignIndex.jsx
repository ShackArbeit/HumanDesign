// 什麼是人類圖：主題入口頁，點卡片進入各主題
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer';
import { content } from '../../data/content';
import style from '../../styles/content.module.css';

const HumanDesignIndex = () => {
  return (
    <PageContainer title="什麼是人類圖" intro="選擇想了解的主題，看看你對人類圖懂多少吧！">
      <ul className={style.grid}>
        {content['hd-index'].map((item) => (
          <li key={item.id}>
            <Link to={item.linkPath} className={style.linkCard}>
              <div className={style.card}>
                <img src={item.imagePath} alt="" loading="lazy" className={style.cardImage} />
                <h2 style={{ fontSize: 'var(--text-h3)' }}>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
};

export default HumanDesignIndex;
