import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { ErrorState } from '../../components/ErrorState';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { SectionTitle } from '../../components/SectionTitle';
import { useContent } from '../../hooks/useContent';
import { useServices } from '../../hooks/useServices';
import style from '../../styles/content.module.css';

function getLowestPrice(service) {
  let lowest = service.options[0].priceTwd;
  for (const option of service.options) {
    if (option.priceTwd < lowest) {
      lowest = option.priceTwd;
    }
  }
  return lowest;
}

const Hero = () => {
  return (
    <section className={style.hero}>
      <div className={style.heroInner}>
        <h1>當八字遇見人類圖</h1>
        <p className={style.heroLead}>
          這是一個讓你找回自我定位的機會。請給自己一點時間聽聽薦骨的回應，生命很簡單，不用給自己太大的壓力。
        </p>
        <div className={style.heroActions}>
          <Button component={Link} to="/booking" variant="contained" color="secondary" size="large">
            立即預約
          </Button>
          <Button
            component={Link}
            to="/human"
            variant="outlined"
            size="large"
            sx={{ color: 'common.white', borderColor: 'common.white' }}
          >
            什麼是人類圖
          </Button>
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const { data: services, isLoading, isError, refetch } = useServices();

  return (
    <section className={style.section}>
      <SectionTitle>解析項目</SectionTitle>
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <ul className={style.grid}>
          {services.map((service) => (
            <li key={service.id}>
              <article className={style.card}>
                {service.imagePath && (
                  <img src={service.imagePath} alt="" loading="lazy" className={style.cardImage} />
                )}
                <h3>{service.name}</h3>
                <p className={style.cardGrow}>{service.description}</p>
                <p className={style.price}>
                  NT$ {getLowestPrice(service).toLocaleString('en-US')} 起
                </p>
                <Button component={Link} to="/booking" variant="outlined">
                  預約{service.name}
                </Button>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const BookingSteps = () => {
  const { data: steps, isLoading, isError, refetch } = useContent('booking-process');

  return (
    <section className={style.section}>
      <SectionTitle>預約流程</SectionTitle>
      {isLoading && <LoadingSkeleton />}
      {isError && <ErrorState onRetry={refetch} />}
      {!isLoading && !isError && (
        <ol className={style.grid}>
          {steps.map((step, index) => (
            <li key={step.id}>
              <div className={style.card}>
                {step.imagePath && (
                  <img src={step.imagePath} alt="" loading="lazy" className={style.cardImage} />
                )}
                <span className={style.step}>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <BookingSteps />
    </>
  );
};

export default HomePage;
