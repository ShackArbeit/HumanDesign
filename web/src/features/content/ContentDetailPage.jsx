import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer';
import { QueryState } from '../../components/QueryState';
import { useContent } from '../../hooks/useContent';
import style from './content.module.css';

const ContentDetailPage = ({ section, title }) => {
  const query = useContent(section);
  return (
    <PageContainer title={title} narrow>
      <QueryState query={query}>
        {(items) => (
          <div className={style.articleList}>
            {items.map((item) => (
              <article key={item.id} className={style.article}>
                <h2>{item.title}</h2>
                {item.imagePath && (
                  <img src={item.imagePath} alt="" loading="lazy" className={style.articleImage} />
                )}
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        )}
      </QueryState>
      <p>
        <Link to="/human">← 回到人類圖介紹</Link>
      </p>
    </PageContainer>
  );
};

export default ContentDetailPage;
