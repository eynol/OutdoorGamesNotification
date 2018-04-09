import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  NavBar,
  Badge,
  Button,
  Icon,
  List,
  Modal,
  Toast,
} from 'antd-mobile';

import { getTimeStr } from '../utils/time';

const Item = List.Item;
const Brief = Item.Brief;
const Fragment = React.Fragment;

const JOIN_TYPE = {
  individual: '个人',
  team: '团队'
}

class GameDetailPage extends React.Component {

  joinGame = () => {
    const { user, dispatch, games } = this.props;
    const { currentGame } = games;

    if (user.online) {
      dispatch({
        type: 'games/joinGame',
        payload: {
          uid: user._id,
          gid: currentGame._id,
          admin: 0,
        }
      })
    } else {
      Modal.alert('未登录', '您未登录账户，但是可以继续输入昵称进行游戏，一旦退出，您的记录将不会保存',
        [{ text: '取消' }, { text: '我有账号', onPress: () => { dispatch(routerRedux.push({ pathname: '/setting' })) } },
        {
          text: '创建临时用户', onPress: () => {
            Modal.prompt('输入昵称', '如果游戏中有人使用该昵称将会添加其他字符', [{ text: '取消' }, {
              text: '加入游戏', onPress: (value) => new Promise((res, rej) => {
                if (value.trim()) {
                  dispatch({
                    type: 'games/joinGame',
                    payload: {
                      uid: user._id,
                      gid: currentGame._id,
                      admin: 0,
                    }
                  })
                } else {
                  Toast.fail('昵称不能为空！');
                }
              })
            }])
          }
        }])
    }
  }
  requestAssistant = () => {
    const { user } = this.props;
    if (user.online) {

    } else {
      Modal.alert('无法申请', '申请管理需要登录账户', [
        { text: '取消' },
        {
          text: '马上登录',
          onPress: this.gotoSetting
        }]);
    }
  }
  gotoSetting = () => {
    this.props.dispatch(routerRedux.push({ pathname: '/setting' }))
  }


  render() {
    const { dispatch, games } = this.props;
    const currentGame = games.currentGame;

    return (
      <div>
        <NavBar mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >详情</NavBar>
        {currentGame && (
          <Fragment>
            <List renderHeader={'标题'}>
              <Item multipleLine>{currentGame.title}</Item>
            </List>
            <List renderHeader={'描述'}>
              <Item multipleLine>{currentGame.desc}</Item>
            </List>
            <List renderHeader={'地址'}>
              <Item multipleLine>{currentGame.location}</Item>
            </List>
            <List renderHeader={'游戏时间'}>
              <Item multipleLine>
                <Badge text={getTimeStr(currentGame.startTime)} />
                至
                  <Badge text={getTimeStr(currentGame.endTime)} />
              </Item>
            </List>
            <List renderHeader={'备注'}>
              <Item multipleLine>
                {currentGame.additions}
              </Item>
            </List>
            <List renderHeader={'游戏类型'}>
              <Item multipleLine>
                {JOIN_TYPE[currentGame.joinType]}
              </Item>
            </List>
            <List renderHeader={'操作'}>
              <Item extra={<Button size="small" type="primary" onClick={this.joinGame}>加入游戏</Button>}>
                我是玩家
                  <Brief>将作为玩家参与到游戏中</Brief>
              </Item>
              <Item extra={<Button size="small" type="primary" onClick={this.requestAssistant}>申请管理</Button>}>
                我是工作人员
                  <Brief>将作为工作人员协助游戏管理</Brief>
              </Item>
            </List>
          </Fragment>)
        }
      </div>
    );
  }

}

GameDetailPage.propTypes = {
};

function mapStateToProps(state) {
  return { games: state.games, user: state.user };
}

export default connect(mapStateToProps)(GameDetailPage);
