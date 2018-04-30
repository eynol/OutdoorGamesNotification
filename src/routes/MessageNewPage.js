import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux, Redirect } from 'dva/router';
import {
  NavBar,
  WingBlank,
  Button,
  Icon,
  List,
  Radio,
  TextareaItem,
  Toast,
} from 'antd-mobile';

const ListItem = List.Item;
const RadioItem = Radio.RadioItem;
const Brief = ListItem.Brief;

const Fragment = React.Fragment;


const MSG_TYPE = {
  all: 'all',
  group: 'group',
  one: 'one',
}

class MessagePage extends React.Component {
  state = {
    toWho: MSG_TYPE.all,
    group: null,
    members: [],
    person: null,
    messageEmpty: true,
  }

  toAll = () => {
    this.setState({ toWho: MSG_TYPE.all, members: [], group: null, person: null, })

  }
  toGroup = () => {
    this.setState({ toWho: MSG_TYPE.group })
  }
  toOne = () => {
    this.setState({ toWho: MSG_TYPE.one })
  }
  changeGroup = (id) => {
    const { toWho } = this.state;
    const { games: { team } } = this.props;

    const theTeam = team.find(t => t._id === id);
    const members = theTeam.members;

    this.setState({ group: id, members, person: null })

  }

  choosePerson = (uid) => {
    this.setState({ person: uid });
  }

  checkMessageEmpty = () => {
    const message = this.message;
    if (!message) {
      this.setState({ messageEmpty: true });
    } else if (message && !message.textareaRef.value.trim()) {
      this.setState({ messageEmpty: true });
    } else {
      this.setState({ messageEmpty: false });
    }
  }
  submit = () => {
    const { games: { team, currentGame, gaming }, user: { _id: uid }, dispatch } = this.props;

    const { toWho, group, members, person, messageEmpty } = this.state;
    const text = this.message.textareaRef.value;

    if (messageEmpty) {
      Toast.fail('要发送的消息为空，不能发送');
    } else {
      dispatch({
        type: 'messages/push',
        payload: { creator: uid, gid: currentGame._id, text, toWho, group, person }
      });
    }

  }
  render() {

    const { games: { team, currentGame, gaming }, user: { _id: uid }, dispatch } = this.props;

    const { toWho, group, members, person, messageEmpty } = this.state;

    if (!gaming) {
      return <Redirect to="/messages" />
    }

    let disableButton = false;

    switch (toWho) {
      case MSG_TYPE.all:
        break;
      case MSG_TYPE.group:
        if (!group) {
          disableButton = true;
        }
        break;
      case MSG_TYPE.one:
        if (!group) {
          disableButton = true;
        } else if (!person) {
          disableButton = true;
        }
        break;
      default: ;
    }


    if (messageEmpty) {
      disableButton = true;
    }

    return (
      <div className="frame">
        <NavBar mode="light"
          className="o-navbar"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >新建推送</NavBar>
        <div className="content">
          <List renderHeader="推送内容">
            <TextareaItem
              rows="5"
              count="300"
              onChange={this.checkMessageEmpty}
              ref={(el) => this.message = el}
              placeholder="请输入推送消息内容" />
            <ListItem><Button type="primary" onClick={this.submit} disabled={disableButton}>立即发送</Button></ListItem>
          </List>
          <List renderHeader="消息类型">
            <RadioItem
              onClick={this.toAll}
              checked={toWho === MSG_TYPE.all}
              platform="android"
            >
              全体通知<Brief>参与这个游戏的所有玩家和管理员都将收到</Brief>
            </RadioItem>
            <RadioItem
              onClick={this.toGroup}
              checked={toWho === MSG_TYPE.group}
              platform="android"
            >
              团队<Brief>只有团队内成员才会会收到</Brief>
            </RadioItem>
            <RadioItem
              onClick={this.toOne}
              checked={toWho === MSG_TYPE.one}
              platform="android"
            >
              悄悄话<Brief>只发送给一个用户</Brief>
            </RadioItem>
          </List>
          {toWho === MSG_TYPE.group || toWho === MSG_TYPE.one ? (
            <List renderHeader={toWho === MSG_TYPE.group
              ? "请选择要收到推送的团队"
              : (
                toWho === MSG_TYPE.one
                  ? '请选择玩家所在团队'
                  : null
              )}>
              {
                team.map(team => <RadioItem
                  key={team._id}
                  checked={group === team._id}
                  onChange={() => this.changeGroup(team._id)}
                >{team.team}
                </RadioItem>)
              }
            </List>
          ) : null}
          {toWho === MSG_TYPE.one ? (
            members.length ? (
              <List renderHeader="请选择收到推送的玩家">
                {members.map(m => <RadioItem
                  onClick={() => this.choosePerson(m._id)}
                  checked={person === m._id}
                  key={m._id} >{m.nickname}</RadioItem>)}
              </List>
            )
              : <WingBlank><p>队伍内无成员,无法发送，请重新选择团队</p></WingBlank>)
            : null}
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
