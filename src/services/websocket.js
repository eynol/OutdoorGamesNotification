const WebSocket = require('isomorphic-ws')
var UUID = require('uuid-js');

let connection = null;
const callbackPool = new Map();
const subscribers = new Map();


export function connect() {

  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = function open() {
    connection = ws;
    console.log('connected');
  };


  ws.onclose = function close() {
    connection = null;
    console.log('disconnected');
  };


  ws.onmessage = function incoming({ data }) {

    if (data === 'ping') {
      ws.send('pong');
      return;
    }

    try {

      data = JSON.parse(data);
      switch (data.type) {
        case 'http': {
          if (data.status >= 200 && data.status <= 300) {
            resolveRequest(data.req_id, data.resp);
          } else {
            rejectRequest(data.req_id, new Error(data.message));
          }
          break;
        }
        default: {//default is ping
          ws.send(new Date.now())
        }
      };
    } catch (e) {
      console.error(e);
    }
  };
}


export function resolveRequest(req_id, data) {
  const proxy = callbackPool.get(req_id);
  proxy.resolve({ data });
  callbackPool.delete(req_id);
}
export function rejectRequest(req_id, err) {
  const proxy = callbackPool.get(req_id);
  proxy.reject({ err });
  callbackPool.delete(req_id);
}

export function request(method, path, data) {


  const req_id = new UUID();
  const sendData = JSON.stringify({
    type: 'http',
    path,
    method,
    data,
    req_id: req_id.toString()
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

  const subid = new UUID().toString()
  subscribers.set(subid, action);

  return unlisten.bind({ id: subid });
}
export function unlisten() {

  subscribers.delete(this.id);

  if (connection) {
    connection.close();
    connection = null;
  }
}
