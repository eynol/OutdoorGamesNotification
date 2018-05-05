import React from 'react';

import { getTimeStr } from '../utils/time';
import { box, messageBox, nickname, date, mine, other, system, rollback } from './MessageBox.css';
import classNames from 'classnames';

import { SYSTEM_ID } from '../models/messages'
import { Badge } from 'antd-mobile';



function MessageBox({ data, uid, currentGame, onDoubleClick }) {

  const { text, _gameId, _creator_nick, read, _creator, reciever, _id, drop, createdAt } = data;
  const createdDate = new Date(createdAt);


  const isMyMessage = _creator === uid;
  const isOwner = _creator === currentGame.owner;
  const isAdmin = currentGame && currentGame.allowedAdmins.includes(uid);
  const isSystem = _creator === SYSTEM_ID;
  const visiable = (reciever && reciever.find(r => r._id === uid));

  console.log('reeeeeeeeeeeed', read);

  if (!visiable && !isSystem) {
    return null;
  }

  if (drop) {
    return <div className={rollback}><span>{_creator_nick}撤回了一条消息</span></div>
  }
  switch (_creator) {
    case SYSTEM_ID:
      return (
        <div className={classNames([messageBox, system])}>
          <div className={date}>
            {getTimeStr(createdAt, 'yyyy-MM-dd HH:mm:ss')}
          </div>
          <div className={nickname}>
            <Badge text={'系统消息'} />
          </div>
          <div className={classNames([box])}>
            {text}
          </div>
        </div>);
    default:
      return (
        <div className={classNames([messageBox, isMyMessage ? mine : other])}>
          <div className={date}>
            {getTimeStr(createdAt, 'yyyy-MM-dd HH:mm:ss')}
          </div>
          <div className={nickname}>
            {visiable && visiable.read ? null : <Badge dot size="small" style={{ marginRight: 6 }} />}
            {isOwner ? <Badge text="创建者" /> : null}
            {isAdmin ? <Badge text="管理员" /> : null}
            {_creator_nick}
          </div>
          <div className={classNames([box])}
            data-mid={_id}
            data-created-at={createdAt}
            onDoubleClick={isMyMessage ? onDoubleClick : null}>
            {text}
          </div>

        </div >)
  }
}

export default MessageBox;
