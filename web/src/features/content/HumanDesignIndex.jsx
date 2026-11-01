import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/PageContainer';
import { QueryState } from '../../components/QueryState';
import { useContent } from '../../hooks/useContent';
import style from './content.module.css';

const HumanDesignIndex = () => {
  const query = useContent('hd-index');
  return (
    <PageContainer title="什麼是人類圖" intro="選擇想了解的主題，看看你對人類圖懂多少吧！">
      <QueryState query={query}>
        {(items) => (
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
      </QueryState>
    </PageContainer>
  );
};

export default HumanDesignIndex;
