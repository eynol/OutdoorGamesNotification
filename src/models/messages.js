import request from '../services/request';
import * as ws from '../services/websocket';
export default {

  namespace: 'messages',

  state: {},

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return ws.listen((msg) => {
        switch (msg.type) {
          case "inbox": {
            break;
          }
          default: break;
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
