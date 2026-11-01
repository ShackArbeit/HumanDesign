import { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { QueryState } from '../../components/QueryState';
import style from '../../CssModules/HumanDesignDetail.module.css';
import { useContent } from '../../hooks/useContent';

const PARALLAX_RATE = 0.095;

const useScrollY = (enabled) => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);
  return scrollY;
};

const ContentRow = ({ item, imageFirst, offset }) => {
  const text = (
    <div className={style.textContainer} style={offset ? { transform: `translateY(-${offset}px)` } : undefined}>
      <h2>{item.title}</h2>
      <p>{item.body}</p>
    </div>
  );
  if (!item.imagePath) {
    return (
      <Row className={style.GelleryRow}>
        <Col xs={12}>{text}</Col>
      </Row>
    );
  }
  const image = (
    <div
      className={style.GelleryImageContainer}
      style={offset ? { transform: `translateY(${offset}px)` } : undefined}
    >
      <img src={item.imagePath} className={style.GelleryImage} alt={item.title} loading="lazy" />
    </div>
  );
  return (
    <Row className={style.GelleryRow}>
      <Col md={6} xs={12} className={style.GelleryColLeft}>
        {imageFirst ? image : text}
      </Col>
      <Col md={6} xs={12} className={style.GelleryColRight}>
        {imageFirst ? text : image}
      </Col>
    </Row>
  );
};

const ContentDetailPage = ({ section, title, parallax = false }) => {
  const query = useContent(section);
  const scrollY = useScrollY(parallax);
  const offset = parallax ? scrollY * PARALLAX_RATE : 0;

  return (
    <Container className={style.HumanDesignWrap} fluid>
      <h1 className={style.HumanDesignMainTitle}>{title}</h1>
      <QueryState query={query}>
        {(items) => (
          <div className={style.GelleryContainer}>
            {items.map((item, index) => (
              <Container fluid key={item.id}>
                <ContentRow item={item} imageFirst={index % 2 === 0} offset={offset} />
              </Container>
            ))}
          </div>
        )}
      </QueryState>
    </Container>
  );
};

export default ContentDetailPage;
