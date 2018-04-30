import React from 'react';

import { getTimeStr, getTimeGap } from '../utils/time';
import { box } from './MessageBox.css';

let timer;
function MessageBox({ data }) {

  const { text, _gameId, _creator_nick, _creator, reciever, _id, drop, createdAt } = data;
  const createdDate = new Date(createdAt);


  switch (_creator) {
    case 'system':
      break;
    default:
      return (
        <div>
          <div>{_creator_nick}</div>
          <div className={box}>
            {text}
          </div>
        </div>)
  }
}

export default MessageBox;
