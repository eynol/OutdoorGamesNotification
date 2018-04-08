
import request from '../services/request';

import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';



export default {

  namespace: 'user',

  state: {
    online: false
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return () => { }
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
    *signin({ payload: values }, { call, put }) {
      try {

        const { data, err } = yield request('/api/user/signin', {
          method: 'post',
          body: values
        });

        if (err) {
          throw err;
        } else if (data.status !== 200) {
          Toast.fail(data.message, 2);
        } else {
          yield put({
            type: 'save',
            payload: data.user,
          });
          yield put(routerRedux.goBack())
          Toast.success('登录成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
      }
    },
    *signup({ payload: values }, { call, put }) {
      try {

        const { data, err } = yield request('/api/user/signup', {
          method: 'post',
          body: values
        });

        if (err) {
          throw err;
        } else if (data.status !== 200) {
          Toast.fail(data.message, 2);
        } else {
          yield put({
            type: 'save',
            payload: data.user,
          });
          yield put(routerRedux.goBack())
          Toast.success('注册成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
      }
    },
    *updatenickname({ payload: nickname, resolve, reject }, { call, put }) {
      try {
        const { data, err } = yield request('/api/user/updatenickname', {
          method: 'post',
          body: { nickname }
        })
        if (err) {
          throw err;
        } else {
          yield put({
            type: 'save',
            payload: { nickname },
          });

          resolve(nickname);
          Toast.success('修改成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
        reject(0);
      }
    },
    *updatepassword({ payload: password, resolve, reject }, { call, put }) {
      try {
        const { data, err } = yield request('/api/user/updatepassword', {
          method: 'post',
          body: { password }
        })
        if (err) {
          throw err;
        } else {
          resolve(password);
          Toast.success('修改成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
        reject(0);
      }
    },
    *signout({ payload }, { call, put }) {
      // const { data } = yield request('/api/user/signout');
      // request websocket.
      yield put({ type: 'exit' });
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, online: true, ...action.payload };
    },
    exit() {
      return {
        online: false
      }
    }
  },

};
