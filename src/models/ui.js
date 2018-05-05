
import * as ws from '../services/websocket';

export default {

  namespace: 'ui',

  state: {
    appbar: true,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen((location) => {
        if (location.pathname === '/chooseteam') {
          dispatch({ type: 'hideBar' })
        } else {
          dispatch({ type: 'showBar' });
        }
      })
    },
    websocket({ dispatch }) {
      return ws.listen(msg => {
        if (msg.type === 'dispatch') {
          dispatch(msg.action);
        }
      })
    }
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
    hideBar(state, action) {
      return { ...state, appbar: false };
    },
    showBar(state, action) {
      if (state.appbar) {
        return state;
      } else {
        return { ...state, appbar: true };
      }
    },
  },

};
