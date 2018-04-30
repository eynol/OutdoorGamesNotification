import request from '../services/request';
import * as ws from '../services/websocket';
import { routerRedux } from 'dva/router';

import { Toast, Modal } from 'antd-mobile';

export default {

  namespace: 'messages',

  state: {
    inited: false,
    messages: []
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen((location) => {

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
            } else {

              Modal.alert('连接异常中断', <div>退出代码:{code}<br />reason:{reason}<br /></div>,
                [{ text: '刷新页面', onPress: () => window.location.reload() },
                { text: '尝试重新连接', onPress: () => dispatch({ type: 'reconnect' }) }]);
            }

            dispatch({
              type: 'save',
              payload: {
                inited: false,
                messages: []
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

      const messages = yield select(state => state.messages);
      if (!messages.inited) {
        ws.send({ type: 'fetchMessages' });
      }

    },

    *push({ payload: message }, { put, take }) {
      ws.send({ ...message, type: 'push' });
      const { payload: result } = yield take('pushMessageResult');

      if (result.status === 'ok') {
        Toast.success('发送成功')
      } else {
        Toast.fail(result.message);
      }
    },
    *reconnect(foo, { put, select }) {
      const { games: { currentGame, gaming }, user: { _id: uid } } = yield select(state => state);
      if (!gaming) {
        Toast.fail('未加入游戏');
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
    putMSG(state, action) {
      console.log(state, action)
      const messages = state.messages.slice();
      messages.push(action.payload)
      return { ...state, messages };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
