import { Link } from 'react-router-dom';
import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PageContainer } from '../../components/PageContainer';
import { useContent } from '../../hooks/useContent';
import style from '../../styles/content.module.css';

const ContentDetailPage = ({ section, title }) => {
  const { data: items, isLoading, isError, refetch } = useContent(section);

  return (
    <PageContainer title={title} narrow>
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
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
      <p>
        <Link to="/human">← 回到人類圖介紹</Link>
      </p>
    </PageContainer>
  );
};

export default ContentDetailPage;
