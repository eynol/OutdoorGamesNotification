import React from 'react';
import { connect } from 'dva';
import { routerRedux, Redirect } from 'dva/router';
import {
  NavBar,
  Button,
  List,
  Radio,
  WingBlank,
  Modal,
  Badge,
  Toast,
  WhiteSpace,
  ActionSheet,
} from 'antd-mobile';
import { Brief } from 'antd-mobile/lib/list/ListItem';

const Item = List.Item;
const Fragment = React.Fragment;
const RadioItem = Radio.RadioItem;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
class TeamChoose extends React.Component {

  state = {
    team: null,
  }
  showAdminMenu = (team) => {
    const { dispatch } = this.props;

    const BUTTONS = ['修改团队名称', '删除团队', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      destructiveButtonIndex: BUTTONS.length - 2,
      cancelButtonIndex: BUTTONS.length - 1,
      // title: 'title',
      maskClosable: true,
      'data-seed': 'logId',
      wrapProps,
    }, (index) => new Promise((resolve, reject) => {
      if (index === BUTTONS.length - 1) {
        resolve();
      } else if (index === 0) {
        Modal.prompt('修改团队名字', '', [{ text: '取消' }, {
          text: '确定修改', onPress: (value) => {
            if (value.trim()) {
              dispatch({
                type: 'games/updateteamname',
                payload: { old: team, now: value },
                resolve,
                reject,
              })
            } else {
              Toast.fail('团队名称不能为空！');
            }
          }
        }])
      }
    }))
  }
  submit = () => {

  }
  refresh = () => {

  }
  render() {
    const { dispatch, games } = this.props;
    const currentGame = games.currentGame;
    if (!currentGame) {
      return (<Redirect replace from="/chooseteam" to="/games" />)
    }
    return (
      <div>
        <NavBar mode="light"
        >团队管理</NavBar>
        {currentGame && (
          <Fragment>
            <List>
              {currentGame.teams && currentGame.teams.length ? (
                <Fragment>
                  {currentGame.teams.map(
                    (team, index) => <Item
                      key={team}
                      arrow="horizontal"
                      multipleLine
                      onClick={this.showMenu.bind(team)}
                      platform="android"
                    >{team}<Brief>团队成员人数：<Badge>3</Badge></Brief>
                    </Item>)}

                </Fragment>
              ) : (
                  <Button onClick={this.refresh}>刷新</Button>
                )}
            </List>
          </Fragment>)
        }
      </div>
    );
  }

}

TeamChoose.propTypes = {
};

function mapStateToProps(state) {
  return { games: state.games, user: state.user };
}

export default connect(mapStateToProps)(TeamChoose);
