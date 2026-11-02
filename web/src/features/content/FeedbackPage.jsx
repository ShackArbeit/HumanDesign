import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { PageContainer } from '../../components/PageContainer';
import { useFeedbackVideos } from '../../hooks/useContent';
import style from '../../styles/content.module.css';

const FeedbackPage = () => {
  const { data: videos, isLoading, isError, refetch } = useFeedbackVideos();

  return (
    <PageContainer
      title="JKの身心靈遊園車"
      intro="人類圖分析師 Jerome 和職場引導師 Kevin，陪伴你在不預期的人生旅程中順流而行，開拓生命的無限可能！"
    >
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <ul className={style.grid}>
          {videos.map((video) => (
            <li key={video.id}>
              <article className={style.card}>
                {video.imagePath && (
                  <img src={video.imagePath} alt="" loading="lazy" className={style.cardImage} />
                )}
                <h2 style={{ fontSize: 'var(--text-h3)' }}>{video.title}</h2>
                <p className={style.cardGrow}>{video.body}</p>
                <a
                  href={`https://youtu.be/${video.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`觀看影片：${video.title}`}
                >
                  觀看影片
                </a>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
};

export default FeedbackPage;
