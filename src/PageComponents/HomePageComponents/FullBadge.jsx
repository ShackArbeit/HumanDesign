import React from 'react'
import style from '../../CssModules/HomePage.module.css'

const FullBadge = () => {
  return (
    <div className={style.homeBannder}>
    <div className={style.bannerContainer}>
    <div className={style.bannerText}>
    <h1>
			當人類圖遇見八字
				<small>
					這是一個讓你找會自我定位的機會
				</small>
			</h1>
			<h2>若有興趣請繼續瀏覽本網頁</h2>
			<p>		請給自己一點時間聽聽薦骨的回應<br/>
				生命很簡單不用給自己有太大的壓力</p>
    </div>
    </div>
    </div>
  )
}

export default FullBadge