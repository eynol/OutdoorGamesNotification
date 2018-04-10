import request from '../services/request';
import * as ws from '../services/websocket';
import pathToRegexp from 'path-to-regexp';

import { routerRedux } from 'dva/router';

import { Toast } from 'antd-mobile';

export default {

  namespace: 'games',

  state: {
    gaming: false,
    list: [],
    currentGame: null,
    useronce: null,
    team: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen((location) => {

        const pathname = location.pathname;

        if (pathname === "/games") {
          dispatch({ type: 'fetch' });
        } else {
          let match = pathToRegexp('/games/detail/:gid').exec(pathname);
          if (match) {
            dispatch({ type: 'fetchDetail', payload: match[1] })
          }
        }
      })
    },
  },

  effects: {
    *fetch({ payload: gamelist }, { call, put }) {  // eslint-disable-line
      let { data } = yield request('/api/games');

      yield put({
        type: 'save',
        payload: data || []
      });
    },
    *fetchDetail({ payload: gid }, { call, put, }) {
      let { data } = yield request(`/api/games/detail/${gid}`);

      yield put({
        type: 'save',
        payload: data,
      })
    },
    *newgame({ payload }, { call, put }) {

      let { data } = yield request('/api/games/newgame', {
        method: 'post',
        body: payload
      });

      yield put({
        type: 'save',
        payload: {
          currentGame: data.result
        }
      });

      yield put(routerRedux.replace({
        pathname: '/gaming'
      }))

      yield put({ type: 'enterGame' });

    },
    *joinGame({ payload }, { call, put }) {

      const { uid, gid, admin, teamorder } = payload;
      const { data } = yield request('/api/games/join');

      ws.connect(data);

    },
    *requestAssistant({ payload }, { call, put, race }) {
      let resolved = false;
      const { gid, uid } = payload;

      function* _requestPermission() {
        const { data } = yield request('/api/games/assistant', {
          method: 'post',
          body: { gid, uid }
        });
        return data;
      }
      const delay = (time) => new Promise((res, rej) => {
        setTimeout(() => {
          res();
        }, time)
      });
      const { permission, timeout } = yield race({
        permission: call(_requestPermission),
        timeout: call(delay, 10000)
      });
      if (permission) {
        yield put({ type: 'joinGame', payload: { gid, uid, admin: 1 } })
      } else {
        Toast.fail('失败');
      }
    },
    *exitGame({ payload }, { call, put }) {

    }

  },

  reducers: {
    enterGame(state, action) {
      return { ...state, gaming: true };
    },
    leaveGame(state, action) {
      return { ...state, gaming: false };
    },
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
