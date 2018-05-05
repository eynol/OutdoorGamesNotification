import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';

import Observer from 'react-intersection-observer'


import {
  NavBar,
  WingBlank,
  WhiteSpace,
  Button,
  Modal,
  ActionSheet,
} from 'antd-mobile';

import { SYSTEM_ID } from '../models/messages';
import MessageBox from '../components/MessageBox';
import ScrollToButtom from '../components/ScrollToButtom';

const Fragment = React.Fragment;

class MessagePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      scrollToButtom: false
    }

  }
  handleScrollBTN = (scrollToButtom) => {
    this.setState({ scrollToButtom })
  }
  onDoubleClick = (event) => {
    const dataset = event.target.dataset;

    const createdAt = dataset['createdAt'];
    const mid = dataset['mid'];
    const { user: { _id: uid }, dispatch } = this.props


    const now = new Date();
    const createdDate = new Date(createdAt);
    const expired = (now - createdDate) / 1000 > 3 * 60;

    if (!expired) {
      Modal.alert('撤回消息', '在消息发送出去的3分钟内可以撤回消息', [
        { text: '取消' },
        {
          text: '立即撤回',
          onPress: () => {
            dispatch({ type: 'messages/drop', payload: mid })
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
  handleReadMessage = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'messages/read',
      payload: params
    });
  }
  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.bottom) {
      this.scrollToButtom();
    }
  }



  componentDidUpdate() {
    if (!this.state.scrollToButtom) {
      this.scrollToButtom();
    }
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
                  onRead={this.handleReadMessage}
                  uid={uid}
                  currentGame={currentGame}
                />))}
            </div>) : (
              <Fragment>
                <WingBlank><p>请先加入游戏或进入游戏频道才能看到推送消息</p></WingBlank>
                <WingBlank><Link to="/games"><Button>查看所有游戏</Button></Link></WingBlank>
              </Fragment>
            )}
          <Observer onChange={inview => this.handleScrollBTN(!inview)}><WhiteSpace /></Observer>
          <ScrollToButtom active={this.state.scrollToButtom} onClick={this.scrollToButtom} />
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
