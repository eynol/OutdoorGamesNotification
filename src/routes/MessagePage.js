import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  WingBlank,
  Button,
  Modal,
} from 'antd-mobile';


import MessageBox from '../components/MessageBox';

const Fragment = React.Fragment;

class MessagePage extends React.Component {

  render() {

    const { messages, games, user } = this.props;

    return (
      <div className="frame">
        <NavBar mode="light"
          className="o-navbar"
          rightContent={games.gaming ? [
            <Link to="/messages/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />
          ] : null}
        >推送信息</NavBar>
        <div className="content">
          {games.gaming ? (<div>{messages.messages.map(msg => <MessageBox data={msg} />)}</div>) : (
            <Fragment>
              <WingBlank><p>请先加入游戏才能看到推送消息</p></WingBlank>
              <WingBlank><Link to="/games"><Button>查看所有游戏</Button></Link></WingBlank>
            </Fragment>
          )}
        </div>
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
