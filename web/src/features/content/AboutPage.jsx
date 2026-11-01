import { PageContainer } from '../../components/PageContainer';
import { QueryState } from '../../components/QueryState';
import { useAboutTimeline } from '../../hooks/useContent';
import style from './content.module.css';

const AboutPage = () => {
  const query = useAboutTimeline();
  return (
    <PageContainer title="關於 Jerome" narrow>
      <QueryState query={query}>
        {(entries) => (
          <ol className={style.timeline}>
            {entries.map((entry) => (
              <li key={entry.year}>
                <span className={style.year}>{entry.year}</span>
                <h2 style={{ fontSize: 'var(--text-h3)' }}>{entry.title}</h2>
                <p>{entry.body}</p>
                {entry.imagePath && (
                  <img src={entry.imagePath} alt="" loading="lazy" className={style.cardImage} />
                )}
              </li>
            ))}
          </ol>
        )}
      </QueryState>
    </PageContainer>
  );
};

export default AboutPage;
