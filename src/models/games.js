import request from '../services/request';
import * as ws from '../services/websocket';
import pathToRegexp from 'path-to-regexp';

import * as LS from '../utils/localstorage';

import { routerRedux } from 'dva/router';

import { Toast, Modal } from 'antd-mobile';
const GAMES_KEY = 'GAMES';
const initialState = LS.get(GAMES_KEY);

export default {

  namespace: 'games',

  state: initialState || {
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
        } else if (['/gaming'].includes(pathname)) {
          dispatch({ type: 'gamingCheck' });
        } else {
          let match = pathToRegexp('/games/detail/:gid').exec(pathname);
          if (match) {
            dispatch({ type: 'fetchDetail', payload: match[1] });
            dispatch({ type: 'gamingCheck' });
          }
        }
      })
    },
    websocketSubscriber({ dispatch }) {
      console.log('websocket subscrib')
      return ws.listen((msg) => {
        switch (msg.type) {
          case 'ASSISTANT_RESP': {
            dispatch({ type: 'ASSISTANT_RESP', result: msg.result });
            break;
          }
          case 'ASSISTANT_REQ': {
            const { game, user } = msg;
            const gid = game._id;
            const uid = user._id;
            const ret = { type: 'ASSISTANT_RESP', gid, uid }
            Modal.alert('允许其他工作人员协助管理', `用户[${user.nickname}]请求协助游戏[${game.title}]，是否允许？`, [
              {
                text: '忽略', onPress: () => {
                  ret.result = '网络故障';
                  ws.send(ret)
                }
              },
              {
                text: '允许', onPress: () => {
                  ret.result = 'ok';
                  ws.send(ret)
                }
              }]);
            break;
          }
          default: ;
        }
      })
    }
  },

  effects: {

    *fetch({ payload: gamelist }, { call, put, select }) {  // eslint-disable-line

      //1.判断当前是否在游戏中，如果是，则跳转至gaming页面。

      const gaming = yield select(state => state.games.gaming);

      if (gaming) {
        yield put(routerRedux.replace({ pathname: '/gaming' }))
        return;
      }

      let { data, err } = yield request('/api/games');

      if (err) {
        Toast.fail(err.message, 2);
        return;
      }

      yield put({
        type: 'save',
        payload: data || []
      });
      yield put({ type: 'store' })

      //2.判断列表中是否有属于自己并且未完成的游戏，如果有，则立即连接websocket,
      const user = yield select(state => state.user);
      const uid = user._id;

      if (!uid && !user.online) {
        //没有id,用户未登录
        //TODO:
        return;
      }

      const ownGames = (data.list || []).reduce((list, game) => {
        if (game.owner === uid || game.allowedAdmins.includes(uid)) {
          list.push(game)
        }

        return list;
      }, []);

      if (ownGames.length) {
        const unfinishedGame = ownGames.find(game => game.status !== 'finished')
        if (unfinishedGame) {
          yield put({
            type: 'save',
            payload: {
              gaming: true,
              currentGame: unfinishedGame
            }
          });
          yield put({ type: 'store' })
          yield put(routerRedux.replace({ pathname: '/gaming' }));
        }
      }
    },
    *fetchDetail({ payload: gid }, { call, put, }) {
      let { data, err } = yield request(`/api/games/detail/${gid}`);
      if (err) {
        let result;
        if (err.response) {
          result = yield err.response.json();
        } else {
          result = err;
        }

        Toast.fail(result.message);
        if (result.message === '游戏被删除了或不存在') {
          yield put({ type: 'gameover' });
          return 'gameover';
        }
      } else {

        yield put({
          type: 'save',
          payload: data,
        });
        yield put({ type: 'store' });
        return data;
      }
    },
    *newgame({ payload }, { call, put }) {

      let { data } = yield request('/api/games/newgame', {
        method: 'post',
        body: payload
      });

      yield put({
        type: 'save',
        payload: {
          gaming: true,
          currentGame: data.result
        }
      });
      yield put({ type: 'store' })

      yield put(routerRedux.replace({ pathname: '/gaming' }))

    },
    *getJoinList({ payload: gid }, { call, put }) {

      try {

        const { data, err } = yield request(`/api/joinlists/${gid}`);
        if (err) {
          Toast.fail(err.message, 2);
        } else {
          if (data.team.length === 0) {
            yield put({ type: 'gameover' });
            Toast.fail('游戏不存在或已被删除');
          } else {
            yield put({ type: 'save', payload: data });
          }
        }
        return data;
      } catch (e) {
        console.log(e);
        Toast.fail(e.message, 2);
      }
    },
    *gamingCheck({ payload }, { call, put, select }) {
      const state = yield select(state => state);
      const user = state.user;
      const uid = user._id;
      const online = user.online;
      const games = state.games;
      let currentGame = games.currentGame;

      console.log('gamecheck');
      if (!online) {
        return;
      }
      if (games.gaming) {
        if (!uid) {
          //没有id，关闭游戏
          yield put({ type: 'gameover' });
        } else {
          //有id
          //检查当前游戏，
          if (!currentGame) {
            //没有当前游戏，退出游戏
            yield put({ type: 'gameover' });
          } else {
            console.log('gamecheck,current');
            currentGame = yield yield put({ type: 'fetchDetail', payload: currentGame._id });

            if (currentGame === 'gameover') {
              return;
            } else if (!currentGame) {
              Toast.fail('获取详情失败');
              return;
            }
            currentGame = currentGame.currentGame;
            // currentGame = yield select(state => state.games.currentGame);
            console.log('current', currentGame);
            //有当前游戏，检查当前游戏自己的身份
            let isAdmin = currentGame.owner === uid || currentGame.allowedAdmins.includes(uid);
            console.log('-----------------isAdmin', isAdmin);
            if (isAdmin) {
              //是管理员
              yield ws.connect(uid);
              ws.joinGame(currentGame._id)
              yield yield put({ type: 'getJoinList', payload: currentGame._id });
            } else {
              //获取参与列表检查是否是参与游戏的玩家
              const data = yield yield put({ type: 'getJoinList', payload: currentGame._id });
              const { team = [] } = data;
              const inTeam = team.find(
                joinlist => joinlist.members.find(
                  member => member._id === uid
                )
              );
              console.log('-----------------inTeam', inTeam);
              if (inTeam) {
                yield ws.connect(uid);
                ws.joinGame(currentGame._id)
                yield yield put({ type: 'save', payload: data });
              } else {
                Toast.fail('未在游戏列表中，请重新加入游戏');
                yield put({ type: 'gameover' });
              }

            }

          }
        }
      }
    },
    *joinGame({ payload }, { call, put, select }) {

      const { uid, gid, tempUser, teamid } = payload;

      //玩家加入游戏 需要根据团队类型 是否跳转到选择团队类型；
      const currentGame = yield select(state => state.games.currentGame);

      if (currentGame.joinType === 'team') {

        if (!teamid) {
          //如果是团队类型的游戏，需要选择团队
          yield put({ type: 'getJoinList', payload: currentGame._id });
          yield put({ type: 'enterGame' });
          yield put(routerRedux.push({ pathname: '/chooseteam' }, { tempUser }));

        } else {

          yield ws.connect(uid, tempUser);
          const { data, err } = yield request('/api/games/join', {
            method: 'post',
            body: { uid, gid, teamid }
          });

          if (err) {
            Toast.fail(err.message);
          } else {
            ws.joinGame(currentGame._id)
            yield put(routerRedux.goBack())
            yield put({ type: 'enterGame' });
            yield put(routerRedux.replace({ pathname: '/gaming' }));
          }

        }

      } else {
        //如果是个人游戏，那么可以直接加入游戏
        try {

          yield ws.connect(uid, tempUser);
          const { data, err } = yield request('/api/games/join', {
            method: 'post',
            body: { uid, gid }
          });

          if (err) {
            Toast.fail(err.message);
          } else {
            ws.joinGame(currentGame._id)
            yield put({ type: 'save', payload: { team: data.team } });
            yield put({ type: 'store' });
            yield put(routerRedux.goBack())
            yield put({ type: 'enterGame' });
            yield put(routerRedux.replace({ pathname: '/gaming' }));
          }

        } catch (e) {
          console.error(e);
          Toast.fail(e.message || e, 2);
        }
      }
    },
    *exitGame({ payload }, { call, put, select }) {
      const state = yield select(state => state);
      const { user, games } = state;
      const uid = user._id;
      const gid = games.currentGame._id;

      let teamid;
      if (games.currentGame.joinType === 'team') {
        const theTeam = games.team.find(team => team.members.find(member => member._id === uid));
        teamid = theTeam._id;
      } else {
        teamid = games.team[0]._id;
      }
      if (games.gaming) {
        yield ws.connect(uid);
        const { data, err } = yield request('/api/games/exit', {
          method: 'post',
          body: { uid, gid, teamid }
        });
        if (err) {
          Toast.fail(err.message);
        } else {
          if (data.result === 'ok') {
            Toast.success('退出成功!');
            yield put({ type: 'gameover' });
          } else {
            Toast.fail(data.result);
          }
        }
      }
    },
    *updateGame({ payload }, { put }) {
      const { data, err } = yield request('/api/games/updategame', {
        method: 'post',
        body: payload,
      });

      if (err) {
        Toast.fail(err.message);
      } else {
        Toast.success('保存成功！');
        yield put(routerRedux.replace({ pathname: '/gaming' }));
      }
    },
    *deleteGame({ payload }, { put }) {
      const { data, err } = yield request('/api/games/delete', {
        method: 'post',
        body: payload,
      });

      if (err) {
        Toast.fail(err.message);
      } else {
        if (data.result === 'ok') {
          Toast.success('删除成功!');
          yield put({ type: 'gameover' });
          yield put(routerRedux.push({ pathname: '/games' }))
        } else {
          Toast.fail(data.result);
        }
      }
    },
    *requestAssistant({ payload }, { call, put, race, take }) {

      const { gid, uid } = payload;

      yield ws.connect(uid);
      ws.send({ type: 'ASSISTANT_REQ', gid, uid });

      const { result } = yield take('ASSISTANT_RESP');

      if (result === 'ok') {
        ws.joinGame(gid)
        yield put(routerRedux.goBack())
        yield put({ type: 'enterGame' });
        yield put(routerRedux.replace({ pathname: '/gaming' }));
      } else {
        Toast.fail(result);
      }
    },
    *gameover({ payload }, { call, put }) {

      ws.close('gameover');

      yield put({
        type: 'save', payload: {
          gaming: false, currentGame: null, team: []
        }
      });
      yield put({ type: 'store' });

      yield put(routerRedux.push({ pathname: '/games' }));
    },
    *scoreadd({ payload }, { put }) {
      const { data, err } = yield request('/api/games/scoreadd', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *scoreminus({ payload }, { put }) {
      const { data, err } = yield request('/api/games/scoreminus', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *updateteamname({ payload }, { put }) {
      const { data, err } = yield request('/api/games/updateteamname', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *createTeam({ payload }, { put }) {
      const { data, err } = yield request('/api/games/createteam', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *deleteteam({ payload }, { put }) {
      const { data, err } = yield request('/api/games/deleteteam', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *switchTeam({ payload }, { put }) {
      const { data, err } = yield request('/api/games/switchteam', {
        method: 'post',
        body: payload
      });

      if (err) {
        Toast.fail(err.message)
      } else {
        yield put({ type: 'save', payload: data });
        yield put({ type: 'store' });
      }
    },
    *beginGame(foo, { put, select }) {
      const { games: { currentGame: { _id: gid } } } = yield select(state => state);


      const { data, err } = yield request('/api/games/begin', {
        method: 'post',
        body: { gid }
      });

      if (err) {
        Toast.fail(err.message)
      }
    },
    *endGame(foo, { put, select }) {

      const { games: { currentGame: { _id: gid } } } = yield select(state => state);

      const { data, err } = yield request('/api/games/end', {
        method: 'post',
        body: { gid }
      });

      if (err) {
        Toast.fail(err.message)
      }
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
    store(state) {
      LS.set(GAMES_KEY, state);
      return state;
    }
  },

};
