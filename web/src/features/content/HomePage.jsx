// 首頁：主視覺、解析項目、預約流程
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../../components/SectionTitle';
import { content } from '../../data/content';
import { services } from '../../data/services';
import style from '../../styles/content.module.css';

// 找出服務的最低價格，用來顯示「NT$ 5,000 起」
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
  return (
    <section className={style.section}>
      <SectionTitle>解析項目</SectionTitle>
      <ul className={style.grid}>
        {services.map((service) => (
          <li key={service.id}>
            <article className={style.card}>
              <img src={service.imagePath} alt="" loading="lazy" className={style.cardImage} />
              <h3>{service.name}</h3>
              <p className={style.cardGrow}>{service.description}</p>
              <p className={style.price}>NT$ {getLowestPrice(service).toLocaleString('en-US')} 起</p>
              <Button component={Link} to="/booking" variant="outlined">
                預約{service.name}
              </Button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

const BookingSteps = () => {
  return (
    <section className={style.section}>
      <SectionTitle>預約流程</SectionTitle>
      <ol className={style.grid}>
        {content['booking-process'].map((step, index) => (
          <li key={step.id}>
            <div className={style.card}>
              <img src={step.imagePath} alt="" loading="lazy" className={style.cardImage} />
              <span className={style.step}>{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
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
