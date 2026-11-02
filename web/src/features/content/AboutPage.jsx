import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PageContainer } from '../../components/PageContainer';
import { useAboutTimeline } from '../../hooks/useContent';
import style from '../../styles/content.module.css';

const AboutPage = () => {
  const { data: entries, isLoading, isError, refetch } = useAboutTimeline();

  return (
    <PageContainer title="關於 Jerome" narrow>
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
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
    </PageContainer>
  );
};

export default AboutPage;
