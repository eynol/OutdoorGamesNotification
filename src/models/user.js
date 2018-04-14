
import request from '../services/request';

import { Toast } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import encode from '../utils/encode';
import getFingerprint from '../utils/fingerprint';

import * as LS from '../utils/localstorage';


let initialState = LS.get('USER');
if (initialState && initialState.tempUser) {
  initialState = null;
}
export default {

  namespace: 'user',

  state: initialState || {
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

        values.password = encode(values.password);
        values.uuid = yield getFingerprint();

        const { data, err } = yield request('/api/user/signin', {
          method: 'post',
          body: values
        });

        if (err) {
          console.log('err', err)
          throw err;
        } else if (data.status !== 200) {
          Toast.fail(data.message, 2);
        } else {
          yield put({
            type: 'save',
            payload: data.user,
          });
          yield put({ type: 'store' });
          yield put(routerRedux.goBack())
          Toast.success('登录成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
      }
    },
    *signup({ payload: values }, { call, put }) {
      try {

        values.password = encode(values.password);
        values.uuid = yield getFingerprint();

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
          yield put({ type: 'store' });
          yield put(routerRedux.goBack())
          Toast.success('注册成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
      }
    },
    *updatenickname({ payload: nickname, resolve, reject }, { call, put, select }) {
      try {
        const _id = yield select(state => state.user._id);
        const { err } = yield request('/api/user/updatenickname', {
          method: 'post',
          body: { _id, nickname }
        })
        if (err) {
          throw err;
        } else {
          yield put({
            type: 'save',
            payload: { nickname },
          });
          yield put({ type: 'store' });
          resolve(nickname);
          Toast.success('修改成功！', 1);
        }
      } catch (e) {
        Toast.fail(e.message, 2);
        reject(0);
      }
    },
    *updatepassword({ payload: password, resolve, reject }, { call, put, select }) {
      try {
        password = encode(password);
        const _id = yield select(state => state.user._id);
        const { err } = yield request('/api/user/updatepassword', {
          method: 'post',
          body: { _id, password }
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
      yield put({ type: 'store' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, online: true, ...action.payload };
    },
    store(state) {
      LS.set('USER', state);
      return state;
    },
    exit() {
      return {
        online: false
      }
    }
  },

};
