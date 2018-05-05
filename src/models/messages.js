import request from '../services/request';
import * as ws from '../services/websocket';
import { routerRedux } from 'dva/router';

import { Toast, Modal } from 'antd-mobile';
import vibrate from '../utils/vibrate'


export const SYSTEM_ID = '5ae701ef83b51ef6ba5c4753';

export default {

  namespace: 'messages',

  state: {
    inited: false,
    messages: [],
    unread: new Set(),
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen((location) => {
        console.log('---------------locationchange')
        console.log(location.pathname);
        const pathname = location.pathname;
        if (['/messages', '/messages/new'].includes(pathname)) {
          dispatch({ type: 'games/gamingCheck' });
        }
      })
    },
    websocket({ dispatch, history }) {  // eslint-disable-line
      return ws.listen((msg) => {
        switch (msg.type) {
          case 'connected': {
            dispatch({ type: 'fetch' })
            break;
          }
          case 'fetchMessages': {
            dispatch({
              type: 'save',
              payload: {
                inited: true,
                messages: msg.messages
              }
            });
            break;
          }
          case 'pushMessageResult': {
            dispatch({ type: 'pushMessageResult', payload: msg })
            break;
          }
          case 'push': {
            dispatch({ type: 'putMSG', payload: msg.message })
            break;
          }
          case 'rollback': {
            dispatch({ type: 'rollback', payload: msg.mid });
            break;
          }
          case 'closed': {
            const { code, reason } = msg.event;

            if (reason === 'auth') {
              Modal.alert('验证失败', '升级浏览器或更新硬件都可能导致登录信息失效，可以重新登录',
                [{ text: '刷新页面', onPress: () => window.location.reload() },
                {
                  text: '重新登录', onPress: () => {
                    dispatch({ type: 'user/signout' });
                    dispatch(routerRedux.push({ pathname: '/setting' }));
                  }
                }])
            } else if (reason === 'timeout') {
              Modal.alert('连接超时', '可能的原因：网络阻塞或服务器阻塞，导致心跳检测失败',
                [{ text: '刷新页面', onPress: () => window.location.reload() },
                { text: '尝试重新连接', onPress: () => dispatch({ type: 'reconnect' }) }]);
            } else if (reason === 'gameover') {
              Toast.fail('游戏已断开');
            } else if (reason === 'kickout') {
              Modal.alert('被迫下线', '您的账号在其他地方登录，您被迫下线');
              dispatch({ type: 'user/signout' });
              dispatch({ type: 'games/gameover' });
            } else {

              Modal.alert('连接异常中断', <div>退出代码:{code}<br />reason:{reason}<br /></div>,
                [{ text: '刷新页面', onPress: () => window.location.reload() },
                { text: '尝试重新连接', onPress: () => dispatch({ type: 'reconnect' }) }]);
            }

            dispatch({
              type: 'save',
              payload: {
                inited: false,
                messages: [],
                unread: new Set(),
              }
            });
            break;
          }
          default: break;
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {  // eslint-disable-line

      const { messages, user } = yield select(state => state);
      if (!messages.inited) {
        ws.send({ type: 'fetchMessages' });
        yield put({ type: 'setuid', uid: user._id });
      }

    },
    *read({ payload: { mid, uid } }, { put }) {
      const { data, err } = yield request('/api/messages/read', {
        method: 'post',
        body: { mid, uid }
      });

      if (err) {
        console.error(err.message || err)
        Toast.fail(err.message || err);
      } else {
        yield put({ type: 'readOne', payload: { mid, uid } });
      }
    },
    *push({ payload: message }, { put, take }) {
      ws.send({ ...message, type: 'push' });
      const { payload: result } = yield take('pushMessageResult');

      if (result.status === 'ok') {
        Toast.success('发送成功,3分钟内双击消息框可以撤回消息');
        yield put(routerRedux.replace({ pathname: '/messages', state: { bottom: true } }));
      } else {
        Toast.fail(result.message);
      }
    },
    *reconnect(foo, { put, select }) {
      const { games: { currentGame, gaming }, user: { _id: uid } } = yield select(state => state);
      if (!gaming) {
        Toast.fail('未加入游戏');
        yield put(routerRedux.replace('/games'));
      } else {
        try {

          const f = yield ws.connect(uid);
          console.log('f', f);
          yield ws.send({ type: 'joinGame', gid: currentGame._id });
        } catch (e) {
          console.error(e);
        }
      }

    },
  },

  reducers: {
    setuid(state, { uid }) {
      return { ...state, uid }
    },
    readOne(state, { uid, mid }) {
      const messages = state.messages.slice();
      const $message = messages.find(msg => msg._id === mid);
      if ($message) {
        const recpt = $message.reciever.find(r => r._id === uid);
        if (recpt) {
          recpt.read = true;
        }
      }

      state.unread.delete(mid);

      return { ...state, messages }
    },
    putMSG(state, action) {
      console.log(state, action);
      vibrate();
      const messages = state.messages.slice();

      const msg = action.payload;
      const uid = state.uid;

      if (msg) {
        const r = msg.reciever.find(r => r._id === uid);
        if (r && r.read === false) {
          state.unread.add(msg._id);
        }
      }
      messages.push(msg);

      const $state = { ...state, messages };
      return $state;
    },
    drop(state, { payload: mid }) {
      const messages = state.messages.slice();
      const target = messages.find(m => m._id === mid);
      if (target) {
        target.drop = true;
      }

      state.unread.delete(mid)
      return { ...state, messages }
    },
    save(state, action) {
      const $state = { ...state, ...action.payload };
      const uid = $state.uid;
      $state.messages.forEach(msg => {
        if (msg) {
          const r = msg.reciever.find(r => r._id === uid);
          if (r && r.read === false) {
            $state.unread.add(msg._id);
          }
        }
      })

      return $state;
    },
  },
};
