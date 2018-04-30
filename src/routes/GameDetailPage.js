import React from 'react';
import { connect } from 'dva';
import { routerRedux, Redirect } from 'dva/router';
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
import UUID from 'uuid-js';



const Item = List.Item;
const Brief = Item.Brief;
const Fragment = React.Fragment;

const JOIN_TYPE = {
  individual: '个人',
  team: '团队'
};

const STATUS_TYPE = {
  waiting: '等待中',
  gaimg: '游戏中',
  finished: '游戏已经结束',
};

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
        }
      })
    } else {
      // Modal.alert('未登录', '您未登录账户，但是可以继续输入昵称进行游戏，一旦退出，您的记录将不会保存',
      //   [{ text: '取消' }, { text: '我有账号', onPress: () => { dispatch(routerRedux.push({ pathname: '/setting' })) } },
      //   {
      //     text: '创建临时用户', onPress: () => {
      //       Modal.prompt('输入昵称', '如果游戏中有人使用该昵称将会添加其他字符', [{ text: '取消' }, {
      //         text: '加入游戏', onPress: (value) => new Promise((res, rej) => {
      //           if (value.trim()) {

      //             const tempNickname = value + Math.ceil(Math.random() * 10000);
      //             const uid = UUID.create(4).toString();
      //             const tempUser = { _id: uid, nickname: tempNickname };

      //             dispatch({
      //               type: 'user/saveTempuser', payload: { tempUser }
      //             });

      //             dispatch({
      //               type: 'games/joinGame',
      //               payload: {
      //                 uid: uid,
      //                 gid: currentGame._id,
      //                 tempUser,
      //               }
      //             });
      //           } else {
      //             Toast.fail('昵称不能为空！');
      //           }
      //         })
      //       }])
      //     }
      //   }])
      Modal.alert('未登录', '您未登录账户', [
        { text: '取消' },
        {
          text: '前往登录',
          onPress: () => {
            dispatch(routerRedux.push({ pathname: '/setting' }));
          }
        }
      ])
    }
  }
  requestAssistant = () => {
    const { user, dispatch, games } = this.props;
    if (user.online) {
      dispatch({
        type: 'games/requestAssistant',
        payload: {
          uid: user._id,
          gid: games.currentGame._id,
        }
      });
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
    const { dispatch, games, user, location, history } = this.props;
    const currentGame = games.currentGame;
    const gaming = games.gaming;
    console.log('check history:', history);

    const pathname = location.pathname;

    if (/^\/games/.test(pathname) && gaming) {
      return <Redirect to='/gaming' />
    }

    return (
      <div>
        <NavBar mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.push({ pathname: '/gaming' }))}
        >详情</NavBar>
        {currentGame && (
          <Fragment>
            <List renderHeader={'标题'}>
              <Item multipleLine>{currentGame.title}</Item>
            </List>
            <List renderHeader={'游戏状态'}>
              <Item multipleLine>{STATUS_TYPE[currentGame.status]}</Item>
            </List>
            <List renderHeader={'描述'}>
              <Item multipleLine>{currentGame.desc}</Item>
            </List>
            <List renderHeader={'地址'}>
              <Item multipleLine>{currentGame.location}</Item>
            </List>
            <List renderHeader={'游戏规则'}>
              <Item multipleLine>{currentGame.rules}</Item>
            </List>
            <List renderHeader={'游戏时间'}>
              <Item multipleLine>
                <Badge text={getTimeStr(currentGame.beginTime)} />
                至
                  <Badge text={getTimeStr(currentGame.endTime)} />
              </Item>
            </List>
            <List renderHeader={'备注'}>
              <Item multipleLine>
                <p>{currentGame.additions}</p>
              </Item>
            </List>
            <List renderHeader={'游戏类型'}>
              <Item multipleLine>
                {JOIN_TYPE[currentGame.joinType]}
              </Item>
            </List>
            {gaming ? null
              : (
                <List renderHeader={'操作'}>
                  <Item extra={<Button size="small"
                    type="primary"
                    disabled={currentGame.status === 'finished'}
                    onClick={this.joinGame}>加入游戏</Button>}>
                    我是玩家
                  <Brief>将作为玩家参与到游戏中</Brief>
                  </Item>
                  <Item extra={<Button size="small" type="primary"
                    disabled={currentGame.status === 'finished'}
                    onClick={this.requestAssistant}>申请管理</Button>}>
                    我是工作人员
                  <Brief>将作为工作人员协助游戏管理</Brief>
                  </Item>
                </List>
              )}
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
