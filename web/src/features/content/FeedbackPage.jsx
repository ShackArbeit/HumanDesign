import { PageContainer } from '../../components/PageContainer';
import { QueryState } from '../../components/QueryState';
import { useFeedbackVideos } from '../../hooks/useContent';
import style from './content.module.css';

const FeedbackPage = () => {
  const query = useFeedbackVideos();
  return (
    <PageContainer
      title="JKの身心靈遊園車"
      intro="人類圖分析師 Jerome 和職場引導師 Kevin，陪伴你在不預期的人生旅程中順流而行，開拓生命的無限可能！"
    >
      <QueryState query={query}>
        {(videos) => (
          <ul className={style.grid}>
            {videos.map((video) => (
              <li key={video.id}>
                <article className={style.card}>
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
      </QueryState>
    </PageContainer>
  );
};

export default FeedbackPage;
