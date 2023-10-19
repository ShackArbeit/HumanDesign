import style from '../../CssModules/HumanDesignDetail.module.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';





export default function ExplainHumanDesign() {
  return (
    <Container className={style.HumanDesignWrap} fluid>
    <h1 className={style.HumanDesignMainTitle}>  You Are Waht You Be !  </h1>
    <div className={style.GelleryContainer}>
    <Container fluid>
                        <Row className={style.GelleryRow}>
                        <Col md={6} xs={12} className={style.GelleryColLeft}>                               
                                          <div className={style.GelleryImageContainer}>
                                                <img src="https://picsum.photos/600/400?random=11" className={style.GelleryImage} />
                                          </div>
  
                              </Col>
                              <Col md={6} xs={12} className={style.GelleryColRight} >
                                <div className={style.textContainer}>
                                <h2>體驗人類圖是一段轉化生命的過程</h2>
                                <p>每一天日常生活的紛擾讓人分心，讓我們越來越偏離自己真正的本質。 人類圖為每個人提供了一本「人生使用說明書」，這是依照我們原始的設定， 以及各自的人生目的來編寫，讓我們得以回到原本來到這個世界上的初衷。 人類圖解釋了冥冥之中，我們身處的宇宙與各自生命的關係， 它揭露了每一個人生命獨特的模式，協助我們重新與自己真實的本質再度連結。
            </p>
                                </div>

                              </Col>
                        </Row>
                  </Container>
    </div>
    </Container>
   
  );
}


