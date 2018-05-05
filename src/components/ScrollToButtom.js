import React from 'react';
import { container, btn, show } from './ScrollToButtom.css';
import classNames from 'classnames';


function ScrollToButtom({ active, onClick }) {
  return (
    <div className={classNames([container, active ? show : null])}>
      <div className={btn} onClick={onClick}>
        滚动到底部
      </div>

    </div>
  )
}
export default ScrollToButtom;
