import Container from 'react-bootstrap/Container';
import style from '../CssModules/Footer.module.css'
import Image from 'react-bootstrap/Image';

const Footer = () => {
      return(
        <>
        <footer className={style.footer} >
          <Container className={style.footerBrand} fluid>
          <Image src='https://humandesignasia.org/storage/charts/2024011011/638404560000000000.png' fluid />
          </Container>
          <Container className={style.footerIntroducer} fluid>
            <div className={style.footerIcons}>
            <div className={style.footerIcon}>
                  <a href=''
                  target="_blank"
                  >
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_line.png'/>
                  </a>
                  <span className={style.footerText}>當八字遇見人類圖</span>
            </div>
                <div className={style.footerIcon}>
                  <a href='https://www.facebook.com/search/top?q=%E4%BA%BA%E9%A1%9E%E5%9C%96%E7%9C%8B%E4%B8%96%E7%95%8C%20jerome%27s%20human%20design'
                         target="_blank"
                  >
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_fb.png'/>
                  </a>
                  <span className={style.footerText}>當八字遇見人類圖</span>
                </div>
                <div className={style.footerIcon}>
                  <a href='https://www.instagram.com/jerome.hdesign/'
                      target="_blank"
                  >
                  <img src='https://sorehunter.com/wp-content/uploads/2020/07/footer_icon_ig.png'/>
                  </a>
                  <span className={style.footerText}>當八字遇見人類圖</span>
                </div>
            </div>
            <div className={style.footerBooking}>
              <p className={style.footerPara}>
                預約須知 ： 
                <br/>
                請先點選預約系統，選取您想要的日期、時間及分析種類。預約成功後請依照匯款指示匯款，當我們收到您的匯款後會寄發預約成功通知信給給您並同時給您線上分析工具。
              </p>
              <p className={style.footerPara}>
                營業時間 ：
                <br/>
                我們的營業時間都方在預約系統內，請您成功預約後勿隨意取消，七天前取消可全額退款，三日前取消酌退百分之五十，前一日取消將不退款。
              </p>
              
            </div>
          </Container>
        </footer>
        <Container className={style.CopyRight} fluid>
        <span className={style.footerParaCopy}>Copyright © 2023 當八字遇見人類圖 Jerome HumanDesign 保留所有權利</span>
        </Container>
        </>
      )
    };
    
    export default Footer;
    