import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  WingBlank,
  Button,
} from 'antd-mobile';


const Fragment = React.Fragment;
const rightContentProps = [
  <Link to="/messages/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />
];

function MessagePage({ messages, games, user }) {

  return (
    <div>
      <NavBar mode="light"
        rightContent={games.gaming ? rightContentProps : null}
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

MessagePage.propTypes = {
};

function mapStateToProps(state) {
  return { messages: state.messages, games: state.games, user: state.user };
}

export default connect(mapStateToProps)(MessagePage);
