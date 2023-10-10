import Container from 'react-bootstrap/Container';
import style from '../CssModules/Footer.module.css'
import Image from 'react-bootstrap/Image';

const Footer = () => {
      return(
        <>
        <footer className={style.footer} >
          <Container className={style.footerBrand} fluid>
          <Image src='https://sorehunter.com/wp-content/uploads/2020/07/home_logo.png' fluid />
          </Container>
          <Container className={style.footerIntroducer} fluid>
            <div className={style.footerIcons}>
            <div className={style.footerIcon}>
                  <a href=''>
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_line.png'/>
                  </a>
                  <span>當八字遇見人類圖</span>
            </div>
                <div className={style.footerIcon}>
                  <a href=''>
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_fb.png'/>
                  </a>
                  <span>當八字遇見人類圖</span>
                </div>
                <div className={style.footerIcon}>
                  <a href=''>
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_ig.png'/>
                  </a>
                  <span>當八字遇見人類圖</span>
                </div>
            </div>
            <div className={style.footerBooking}>
              <p>
                預約須知 ： 
                <br/>
                請先點選預約系統，選取您想要的日期、時間及分析種類。預約成功後請依照匯款指示匯款，當我們收到您的匯款後會寄發預約成功通知信給給您並同時給您線上分析工具。
              </p>
              <p>
                營業時間 ：
                <br/>
                我們的營業時間都方在預約系統內，請您成功預約後勿隨意取消，七天前取消可全額退款，三日前取消酌退百分之五十，前一日取消將不退款。
              </p>
              
            </div>
          </Container>
        </footer>
        <Container className={style.CopyRight} fluid>
        <span>Copyright © 2023 當八字遇見人類圖 Jerome HumanDesign 保留所有權利</span>
        </Container>
        </>
      )
    };
    
    export default Footer;
    