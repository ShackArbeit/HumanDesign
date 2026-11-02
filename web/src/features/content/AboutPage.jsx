// 認識 Jerome 頁面：用時間軸顯示經歷，資料寫在 data/content.js
import { PageContainer } from '../../components/PageContainer';
import { aboutTimeline } from '../../data/content';
import style from '../../styles/content.module.css';

const AboutPage = () => {
  return (
    <PageContainer title="關於 Jerome" narrow>
      <ol className={style.timeline}>
        {aboutTimeline.map((entry) => (
          <li key={entry.year}>
            <span className={style.year}>{entry.year}</span>
            <h2 style={{ fontSize: 'var(--text-h3)' }}>{entry.title}</h2>
            <p>{entry.body}</p>
            <img src={entry.imagePath} alt="" loading="lazy" className={style.cardImage} />
          </li>
        ))}
      </ol>
    </PageContainer>
  );
};

export default AboutPage;
