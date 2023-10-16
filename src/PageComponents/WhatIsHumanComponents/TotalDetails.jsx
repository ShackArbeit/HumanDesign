// Boxes.js
import React from 'react';
import style from '../../CssModules/HumanDesignIntroduce.module.css'

const Boxes = () => {
  return (
    <>
      <ul className={style.boxContainer}>
        <li className={style.box1}>金魚</li>
        <li className={style.box2}>暴力網頁</li>
        <li className={style.box3}>切版</li>
        <li className={style.box4}>網頁入門</li>
        <li className={style.box5}>CSS</li>
        <li className={style.box6}>HTML</li>
        <li className={style.box7}>網頁教學</li>
        <li className={style.box8}>RWD網頁</li>
        <li className={style.box9}>Bootstrap</li>
      </ul>

      <p className={style.footerText}>
        本文是配合
        <a
          href="https://ithelp.ithome.com.tw/users/20112550/ironman/2623"
          className={style.link}
        >
          此教學文章
        </a>
        使用的範例，但內容文字所提的都是真實的呦。
      </p>
    </>
  );
};

export default Boxes;
