import { Link } from 'react-router-dom';
import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PageContainer } from '../../components/PageContainer';
import { useContent } from '../../hooks/useContent';
import style from '../../styles/content.module.css';

const HumanDesignIndex = () => {
  const { data: items, isLoading, isError, refetch } = useContent('hd-index');

  return (
    <PageContainer title="什麼是人類圖" intro="選擇想了解的主題，看看你對人類圖懂多少吧！">
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <ul className={style.grid}>
          {items.map((item) => (
            <li key={item.id}>
              <Link to={item.linkPath} className={style.linkCard}>
                <div className={style.card}>
                  {item.imagePath && (
                    <img src={item.imagePath} alt="" loading="lazy" className={style.cardImage} />
                  )}
                  <h2 style={{ fontSize: 'var(--text-h3)' }}>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
};

export default HumanDesignIndex;
