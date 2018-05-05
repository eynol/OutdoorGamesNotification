import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  WingBlank,
  Button,
  Modal,
  ActionSheet,
} from 'antd-mobile';

import { SYSTEM_ID } from '../models/messages';
import MessageBox from '../components/MessageBox';
import ScrollToButtom from '../components/ScrollToButtom';

const Fragment = React.Fragment;

class MessagePage extends React.Component {

  onDoubleClick = (event) => {
    const dataset = event.target.dataset;

    const createdAt = dataset['createdAt'];
    const mid = dataset['mid'];

    const now = new Date();
    const createdDate = new Date(createdAt);
    const expired = (now - createdDate) / 1000 > 3 * 60;

    if (!expired) {
      Modal.alert('撤回消息', '在消息发送出去的3分钟内可以撤回消息', [
        { text: '取消' },
        {
          text: '立即撤回',
          onPress: () => {
            Modal.alert('cehui')
          }
        }
      ])
    }
  }

  scrollToButtom = () => {
    if (this.buttom) {
      this.buttom.scrollIntoView({ behavior: 'smooth' })
    }
  }
  componentDidMount() {
    this.setState({
      height: this.content.scrollHeight,
      top: this.content.scrollTop,
      viewHeight: this.content.clientHeight,
    });

    const { state } = this.props.location;
    if (state && state.bottom) {
      this.scrollToButtom();
    }

    this.content.addEventListener('scroll', this.updateScroll);

    console.log('---------location------------');
    console.log(this.props.location.state);
  }
  componentWillUnmount() {
    this.content.removeEventListener('scroll', this.updateScroll)
  }
  updateScroll = () => {
    const { top, height } = this.state;
    const $top = this.content.scrollTop;
    const $height = this.content.scrollHeight;
    if (top !== $top || height !== $height) {
      this.setState({ top: $top, height: $height });
    }
  }
  componentWillReceiveProps(next, b) {
    console.log(next, b);
    if (this.content) {
      console.log(this.content.scrollTop, this.content.scrollHeight);
    }

  }
  componentDidUpdate() {
    console.log(this.content.scrollTop, this.content.scrollHeight, this.state);
  }
  render() {

    const { messages, games, user, location } = this.props;
    const { currentGame } = games;
    const { _id: uid } = user;
    return (
      <div className="frame">
        <NavBar mode="light"
          className="o-navbar"
          rightContent={games.gaming ? [
            <Link to="/messages/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />
          ] : null}
        >推送信息</NavBar>
        <div className="content" ref={node => this.content = node}>
          {games.gaming ? (
            <div>
              {messages.messages.map(msg => (
                <MessageBox
                  data={msg}
                  key={msg._id}
                  onDoubleClick={this.onDoubleClick}
                  uid={uid}
                  currentGame={currentGame}
                />))}
            </div>) : (
              <Fragment>
                <WingBlank><p>请先加入游戏或进入游戏频道才能看到推送消息</p></WingBlank>
                <WingBlank><Link to="/games"><Button>查看所有游戏</Button></Link></WingBlank>
              </Fragment>
            )}
          <ScrollToButtom onClick={this.scrollToButtom} />
          <div ref={node => this.buttom = node}></div>
        </div>
      </div >
    );
  }
}


MessagePage.propTypes = {
};

function mapStateToProps(state) {
  return { messages: state.messages, games: state.games, user: state.user };
}

export default connect(mapStateToProps)(MessagePage);
