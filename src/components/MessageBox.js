import React from 'react';

import { getTimeStr, getTimeGap } from '../utils/time';

let timer;
function MessageBox({ data }) {

  const { text, _gameId, _creator, reciever, _id, drop, createdAt } = data;
  const createdDate = new Date(createdAt);


  switch (_creator) {
    case 'system':
      break;
    default:
      return (
        <div>

        </div>)
  }
}

export default MessageBox;
