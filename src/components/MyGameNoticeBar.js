import React from 'react';

import { getTimeStr, getTimeGap } from '../utils/time';

let timer;
class MyGameNoticeBar extends React.Component {
  componentWillMount() {
    clearInterval(timer);
    setInterval(() => {
      this.forceUpdate();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(timer);
  }
  render() {

    const { status, beginDate, autoBegin, endDate, autoEnd } = this.props;
    const now = new Date();
    let noticeText;



    switch (status) {
      case 'waiting': {
        if (now < beginDate) {
          noticeText = '距离游戏开始还有' + getTimeGap(now, beginDate);
        } else if (autoBegin) {
          noticeText = '已到达游戏开始时间，请等待管理员指示';
        } else {
          noticeText = '等待游戏开始';
        }
        break;
      }
      case 'gaming': {
        if (now < endDate) {
          noticeText = '距离游戏结束还有' + getTimeGap(now, endDate);
        } else if (autoEnd) {
          noticeText = '已到达游戏结束时间，请等待管理员指示';
        } else {
          noticeText = '游戏中'
        }
        break;
      }
      case 'finished': {
        noticeText = '游戏已经结束';
        break;
      }
      default: ;
    }

    return noticeText;
  }
}

export default MyGameNoticeBar;
