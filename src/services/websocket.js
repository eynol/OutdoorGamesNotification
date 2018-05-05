import WebSocket from 'isomorphic-ws';
import UUID from 'uuid-js';
import getFingerprint from '../utils/fingerprint';
import encode from '../utils/encode';



let connection = null;
const callbackPool = new Map();
const subscribers = new Map();

let heartbeatTimmer = null;

export function send(json) {
  if (connection) {
    connection.send(JSON.stringify(json));
  }
}

export function joinGame(gid) {
  send({ type: 'joinGame', gid })
}

export function connect(user_id, game_id) {
  if (connection) {
    return Promise.resolve();
  } else {
    if (!user_id) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {

      const host = window.location.hostname + ':3000';
      let ws;
      try {
        ws = new WebSocket('ws://' + host);
        ws.onerror = function (e){
          console.error(e);
          reject(e);
        }
      } catch (e) {
        console.error(e);
        reject(e);
      }

      ws.onopen = function open() {
        connection = ws;
        heartbeatTimmer = setInterval(() => {
          ws.send('1');
        }, 15000);
        console.log('connected');
      };


      ws.onclose = function close(event) {
        connection = null;
        clearInterval(heartbeatTimmer);
        setTimeout(() => {
          for (let action of subscribers.values()) {
            action({ type: 'closed', event });
          }
        }, 4)
        console.log('disconnected', event);
      };


      ws.onmessage = function incoming({ data }) {

        // console.log('message:', data)
        if (data === 'ping') {
          ws.send('pong');
          return;
        }

        try {

          data = JSON.parse(data);
          switch (data.type) {
            case 'http': {
              console.log(data);
              if (data.status >= 200 && data.status <= 300) {
                resolveRequest(data.req_id, data.resp);
              } else {
                resolveRequest(data.req_id, undefined, data.resp);
              }
              break;
            }
            case 'auth-1': {
              ws.$$session = data.session;

              getFingerprint().then(fingerprint => {

                const ret = { type: 'auth-2' };
                const encrypted = encode(fingerprint, 'websocket', '/', ws.$$session);
                // const encrypted = encode.sha256(fingerprint + ws.$$session);

                console.log('fingerprint', fingerprint, encrypted, ws.$$session);
                ret.uid = user_id;
                ret.gid = game_id;
                ret.token = encrypted;

                ws.send(JSON.stringify(ret));
              });


              break;
            }
            case 'auth-3': {
              if (data.result === 'ok') {
                resolve();

                setTimeout(() => {
                  for (let action of subscribers.values()) {
                    action({ type: 'connected' });
                  }
                }, 4);
              } else {
                reject(data.result);
              }
              break;
            }

            default: {//default is ping
              for (let action of subscribers.values()) {
                action(data);
              }
            }
          };
        } catch (e) {
          console.error(e);
        }
      };
    })
  }
}


export function resolveRequest(req_id, data, err) {
  const proxy = callbackPool.get(req_id);
  proxy.resolve({ data, err });
  callbackPool.delete(req_id);
}
export function rejectRequest(req_id, err) {
  const proxy = callbackPool.get(req_id);
  proxy.reject({ err });
  callbackPool.delete(req_id);
}

export function request(path, data) {


  const req_id = UUID.create(4).toString();
  const sendData = JSON.stringify({
    type: 'http',
    path,
    data,
    req_id: req_id
  });

  return new Promise((resolve, reject) => {
    connection.send(sendData);
    callbackPool.set(req_id, { resolve, reject });
  });
}

export function isActive() {
  return connection !== null;
}


export function listen(action) {

  const subid = UUID.create(4).toString()
  subscribers.set(subid, action);

  return unlisten.bind({ id: subid });
}
export function unlisten() {

  subscribers.delete(this.id);
  close('unlisten')
}
export function close(reason) {
  if (connection) {
    connection.close(1000, reason || '=');
    connection = null;
  }
}
