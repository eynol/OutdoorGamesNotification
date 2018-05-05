import React from 'react';
import { container, btn } from './ScrollToButtom.css';

function ScrollToButtom({ onClick }) {
  return (
    <div className={container}>
      <div className={btn} onClick={onClick}>
        滚动到底部
      </div>

    </div>
  )
}
export default ScrollToButtom;
