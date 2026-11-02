// 人類圖各主題共用的內容頁，section 決定要顯示 data/content.js 的哪一區
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer';
import { content } from '../../data/content';
import style from '../../styles/content.module.css';

const ContentDetailPage = ({ section, title }) => {
  return (
    <PageContainer title={title} narrow>
      <div className={style.articleList}>
        {content[section].map((item) => (
          <article key={item.id} className={style.article}>
            <h2>{item.title}</h2>
            <img src={item.imagePath} alt="" loading="lazy" className={style.articleImage} />
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <p>
        <Link to="/human">← 回到人類圖介紹</Link>
      </p>
    </PageContainer>
  );
};

export default ContentDetailPage;
