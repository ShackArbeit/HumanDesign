import style from '../../CssModules/HumanDesignDetail.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect,useState} from 'react';
import { useTypeHumanDesign } from '../../ReactQueryCompoents/WhatisHumanDesign';



export default function TalentHumanDesign() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const{data:datas,isLoading,error}=useTypeHumanDesign()
  if(isLoading) return <p>Loading...</p>
  if(error) return <p>Error :{error.message}</p>

  return (
    <Container className={style.HumanDesignWrap} fluid>
    <h1 className={style.HumanDesignMainTitle}>  知悉天賦比努力更重要 !  </h1>
    <div className={style.GelleryContainer}>
    {datas.map((data, index) => (
      <Container fluid key={data.id}>
        <Row className={style.GelleryRow}>
          {index % 2 === 0 ? ( 
            <>
              <Col md={6} xs={12} className={style.GelleryColLeft}>
                <div className={style.GelleryImageContainer}
                style={{ backgroundAttachment: 'fixed', transform: `translateY(${scrollY * 0.095}px)` }}
                >
                  <img src={data.url} className={style.GelleryImage} alt={data.title} />
                </div>
              </Col>
              <Col md={6} xs={12} className={style.GelleryColRight}>
                <div className={style.textContainer}
                style={{ transform: `translateY(-${scrollY * 0.095}px)` }}
                >
                  <h2>{data.title}</h2>
                  <p>{data.content}</p>
                </div>
              </Col>
            </>
          ) : (
            <>
              <Col md={6} xs={12} className={style.GelleryColLeft}>
                <div className={style.textContainer}
                style={{ transform: `translateY(-${scrollY * 0.095}px)` }}
                >
                  <h2>{data.title}</h2>
                  <p>{data.content}</p>
                </div>
              </Col>
              <Col md={6} xs={12} className={style.GelleryColRight}>
                <div className={style.GelleryImageContainer}
                style={{ backgroundAttachment: 'fixed', transform: `translateY(${scrollY * 0.095}px)` }}
                >
                  <img src={data.url} className={style.GelleryImage} alt={data.title} />
                </div>
              </Col>
            </>
          )}
        </Row>
      </Container>
    ))}
  </div>
    </Container>
   
  );
}




