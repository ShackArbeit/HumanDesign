import style from '../../CssModules/HomePage.module.css'
import React from 'react'

const BriefIntroduce = () => {
  return (
    <div className={style.briefWrap}>
    <h1 style={{marginBottom:'2rem'}}>What is Human Design ?</h1>
    <div className={style.briefItems}>
    <div className={style.briefImage}>
      <img src="https://picsum.photos/600/350?random=10"/>
    </div>
    <div className={style.briefText}>
    <h2>Jüdische Gemeinden in Deutschland: "Einfach nur Angst"</h2>
			<p>Nach den Terrorangriffen der Hamas in Israel schauen die jüdischen Gemeinden auf die Entwicklung in Nahost. Sie haben Sorge, auch in Deutschland nicht mehr sicher zu sein.
            </p>
    </div>
    </div>
    <div className={style.briefItems}>
    <div className={style.briefText}>
    <h2>Jüdische Gemeinden in Deutschland: "Einfach nur Angst"</h2>
			<p>Nach den Terrorangriffen der Hamas in Israel schauen die jüdischen Gemeinden auf die Entwicklung in Nahost. Sie haben Sorge, auch in Deutschland nicht mehr sicher zu sein.
            </p>
    </div>
    <div className={style.briefImage}>
      <img src="https://picsum.photos/600/350?random=11"/>
    </div>
    </div>
    </div>
  )
}

export default BriefIntroduce