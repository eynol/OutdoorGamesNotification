import React from 'react';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';
import { withRouter } from 'dva/router';

import * as ws from '../services/websocket';

class KeepAlive extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      umounted: false,
    }
  }
  componentDidMount() {
    let connecting = false;
    const timmer = setInterval(() => {
      const { unmounted } = this.state;
      const { games, user } = this.props;

      if (unmounted) { clearTimeout(timmer); return }

      if (games.gaming) {
        if (!ws.isActive()) {
          if (connecting) {
            Toast.fail(`WebSocket连接中断,尝试重新连接`, 500);
          } else {
            connecting = true;
            Toast.fail('WebSocket连接中断,尝试重新连接', 500);
            ws.connect(user._id).then(() => {
              Toast.success('连接成功！')
            }).catch(e => {
              Toast.fail('连接失败：' + (e.message || e));
            }).then(() => {
              connecting = false;
            });
          }
        }
      }
    }, 500);
  }

  componentWillUnmount() {
    this.setState({
      unmounted: true
    })
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    games: state.games
  }
}

export default withRouter(connect(mapStateToProps)(KeepAlive));
