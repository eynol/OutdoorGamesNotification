
export default {
  // Support type as Object and Array
  'GET /api/games': {
    list: [{
      _id: "@a",
      owner: "u@1",
      title: 'Game title here',
      desc: '游戏描述',
      location: "重庆市南岸区崇文路2号珊瑚广场",
      beginTime: 132344343443,
      endTime: 13435345345,
      autoBegin: true,
      autoEnd: true,
      additions: "其他描述",
      joinType: "individual",
    }]
  },
  'GET /api/games/detail/:gid': {
    currentGame: {
      _id: "@a",
      owner: "u@1",
      title: 'Game title here',
      desc: '游戏描述',
      location: "重庆市南岸区崇文路2号珊瑚广场",
      beginTime: 132344343443,
      endTime: 13435345345,
      autoBegin: true,
      autoEnd: true,
      additions: "其他描述",
      joinType: "individual",
      teams: ['yoooo', 'xxxxx']
    }
  },
  'POST /api/user/signin': (req, res) => {
    if (Math.random() > 0.5) {
      res.end(JSON.stringify({ status: 404, message: '密码错误' }));
    } else {
      res.end(JSON.stringify({
        status: 200,
        user: {
          _id: 'u@q',
          nickname: '用户昵称',
          email: 'yoooooo@yoo.com'
        }
      }));

    }
  },
  'POST /api/user/signup': (req, res) => {
    if (Math.random() > 0.5) {
      res.end(JSON.stringify({ status: 404, message: '用户名已经被注册过了' }));
    } else {
      res.end(JSON.stringify({
        status: 200,
        user: {
          _id: 'u@q',
          nickname: '用户昵称',
          email: 'yoooooo@yoo.com'
        }
      }));

    }
  },
  'POST /api/user/updatenickname': {
    status: 200,
    result: {
      nickname: '修改后的昵称'
    }
  },
  'POST /api/user/updatepassword': {
    status: 200,
    message: '修改成功！'
  },

  // Method like GET or POST can be omitted
  '/api/users/1': { id: 1 },

  // Support for custom functions, the API is the same as express@4
  'POST /api/users/create': (req, res) => { res.end('OK'); },
};
