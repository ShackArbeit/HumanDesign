import style from '../../CssModules/HumanDesignIntroduce.module.css'
import HoverHumanDesign from './HoverHumanDesign'
import TotalDetails from './TotalDetails'

const EntranceHumanDesign = () => {
  return (
    <div className={style.HumanDesignWrap}>
      <h1 className={style.HumanDesignMainTitle}>What is Human Design ? </h1>
      <h4 style={{marginBottom:'40px'}}>請滑看以下圖片看看你對人類圖懂多少吧 !</h4>
      <HoverHumanDesign/>
      <TotalDetails/>
    </div>
  )
}

export default EntranceHumanDesign
