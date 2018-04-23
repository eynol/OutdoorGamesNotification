import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  WingBlank,
  Button,
  Modal,
} from 'antd-mobile';


const Fragment = React.Fragment;

class MessagePage extends React.Component {
  chooseMessageType = () => {
    Modal.alert('新增推送消息', '请选择您要发送的消息类型', [
      {
        text: '所有人',
        onPress: () => { }
      },
      {
        text: '仅团队内',
        onPress: () => {

        }
      },
      {
        text: '悄悄话',
        onPress: () => {

        }
      },
      {
        text: '取消'
      }
    ])
  }

  render() {

    const { messages, games, user } = this.props;

    return (
      <div>
        <NavBar mode="light"
          rightContent={games.gaming ? [
            <div key="0" onClick={this.chooseMessageType}
              className="iconfont icon-27CIRCLE" style={{ width: 22 }} />
          ] : null}
        >推送信息</NavBar>
        {games.gaming ? (<div>gaming</div>) : (
          <Fragment>
            <WingBlank><p>请先加入游戏才能看到推送消息</p></WingBlank>
            <WingBlank><Link to="/games"><Button>查看所有游戏</Button></Link></WingBlank>
          </Fragment>
        )}
      </div>
    );
  }
}


MessagePage.propTypes = {
};

function mapStateToProps(state) {
  return { messages: state.messages, games: state.games, user: state.user };
}

export default connect(mapStateToProps)(MessagePage);
