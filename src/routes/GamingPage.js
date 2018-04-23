import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link, Redirect } from 'dva/router';
import {
  NavBar,
  Badge,
  Button,
  Icon,
  List,
  Modal,
  Toast,
  NoticeBar,
  WingBlank,
  ActionSheet,
} from 'antd-mobile';
import MyGameNoticeBar from '../components/MyGameNoticeBar';

import { getTimeStr, getTimeGap } from '../utils/time';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

const OVERFLOW_COUNT = 100000000000000;

const Item = List.Item;
const Brief = Item.Brief;
const Fragment = React.Fragment;

const JOIN_TYPE = {
  individual: '个人',
  team: '团队'
}

class GameDetailPage extends React.Component {



  showScoreAction = (isTeam, isAdmin, teamid, teamname) => {

    console.log(isTeam, isAdmin)
    const { dispatch, user, games } = this.props;
    const uid = user._id;
    const { team, currentGame } = games;
    const gid = currentGame._id;
    const isPlayer = team.find(t => t.members.find(member => member._id === user._id))
    const isCurrentTeam = isPlayer && teamid === isPlayer._id;
    const originteam = isPlayer && isPlayer._id;


    if (isTeam) {
      if (isAdmin) {
        ActionSheet.showActionSheetWithOptions({
          options: ['奖励得分', '惩罚减分', '修改团队名称', '删除团队', '取消'],
          destructiveButtonIndex: 3,
          cancelButtonIndex: 4,
          maskClosable: true,
          wrapProps,
        }, (index, rowIndex) => {
          switch (index) {
            case 0:
            case 1: {
              Modal.prompt(index === 0 ? '奖励得分' : '惩罚减分',
                '请输入理由，可以不填写', [{ text: '取消' },
                {
                  text: '确定', onPress: (reason) => {
                    Modal.prompt(index === 0 ? '奖励得分' : '惩罚减分',
                      '请输入分值', [{ text: '取消' },
                      {
                        text: '确定', onPress: (score) => {
                          score = Number(score);
                          if (Number.isNaN(score)) {
                            Toast.fail('请输入正确的得分');
                          } else if (score <= 0) {
                            Toast.fail('分值不能小于或等于零');
                          } else {
                            dispatch({
                              type: index === 0 ? 'games/scoreadd' : 'games/scoreminus',
                              payload: {
                                isTeam: !!isTeam,
                                teamid,
                                uid,
                                gid,
                                reason,
                                score,
                              }
                            })
                          }
                        }
                      }]);
                  }
                }])
              break;
            }
            case 2: {
              Modal.prompt('修改团队名称', '', [
                { text: '取消' },
                {
                  text: '确定', onPress: (newname) => {
                    newname = newname.trim();

                    if (newname === teamname) return;
                    if (newname) {
                      dispatch({
                        type: 'games/updateteamname',
                        payload: {
                          teamid,
                          gid,
                          name: newname,
                        }
                      })
                    } else {
                      Toast.fail('团队名称不能为空');
                    }
                  }
                }], 'default', teamname);
              break;
            }
            case 3: {
              Modal.alert('确定删除该团队？', '团队人数不为零时不能删除', [
                { text: '取消' },
                {
                  text: '确定', onPress: () => {
                    dispatch({ type: 'games/deleteteam', payload: { uid, teamid, gid } });
                  }
                }]);
              break;
            }
            default: ;
          }
        });
      } else {
        ActionSheet.showActionSheetWithOptions({
          options: ['切换至该团队', '修改团队名称', '取消'],
          cancelButtonIndex: 2,
          maskClosable: true,
          wrapProps,
        }, (index, rowIndex) => {
          if (index === 0) {
            if (isCurrentTeam) {
              Toast.fail('已经在当前团队');
            } else {
              dispatch({ type: 'games/switchTeam', payload: { teamid, uid, gid, originteam } });
            }
          } else if (index === 1) {
            Modal.prompt('修改团队名称', '', [
              { text: '取消' },
              {
                text: '确定', onPress: (newname) => {
                  newname = newname.trim();

                  if (newname === teamname) return;
                  if (newname) {
                    dispatch({
                      type: 'games/updateteamname',
                      payload: {
                        teamid,
                        gid,
                        name: newname,
                      }
                    })
                  } else {
                    Toast.fail('团队名称不能为空');
                  }
                }
              }], 'default', teamname);
          }
        });
      }
    } else {
      if (isAdmin) {
        ActionSheet.showActionSheetWithOptions({
          options: ['奖励得分', '惩罚减分', '取消'],
          cancelButtonIndex: 2,
          maskClosable: true,
          wrapProps,
        }, (index, rowIndex) => {
          if (index === 0 || index === 1) {
            Modal.prompt(index === 0 ? '奖励得分' : '惩罚减分',
              '请输入理由，可以不填写', [{ text: '取消' },
              {
                text: '确定', onPress: (reason) => {
                  Modal.prompt(index === 0 ? '奖励得分' : '惩罚减分',
                    '请输入分值', [{ text: '取消' },
                    {
                      text: '确定', onPress: (score) => {
                        score = Number(score);
                        if (Number.isNaN(score)) {
                          Toast.fail('请输入正确的得分');
                        } else if (score <= 0) {
                          Toast.fail('分值不能小于或等于零');
                        } else {
                          dispatch({
                            type: index === 0 ? 'games/scoreadd' : 'games/scoreminus',
                            payload: {
                              isTeam: !!isTeam,
                              teamid,
                              uid,
                              reason,
                              score,
                            }
                          })
                        }
                      }
                    }]);
                }
              }])
          }
        });
      } else {
        Toast.success('yooo');
      }
    }
  }
  wannaExit = () => {
    const { dispatch } = this.props;

    Modal.alert('您确定要退出游戏？', '退出游戏后，您的得分将会归0',
      [{ text: '取消' },
      {
        text: '退出游戏', onPress: () => {
          dispatch({ type: 'games/exitGame' })
        }
      }]);
  }

  createTeam = () => {

    const { dispatch, games, user } = this.props;
    const uid = user._id;
    const gid = games.currentGame._id;

    Modal.prompt('新增团队请', '输入新团队的名字', [{ text: '取消' }, {
      text: '确定', onPress: (value) => {
        value = value.trim();
        if (value) {
          dispatch({
            type: 'games/createTeam',
            payload: { gid, name: value, uid }
          })
        } else {
          Toast.fail('团队名字不能为空!');
        }
      }
    }])
  }

  startGame = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'games/beginGame' });
  }
  endGame = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'games/endGame' });
  }
  render() {
    const { dispatch, games, user } = this.props;
    const currentGame = games.currentGame;
    let team = games.team;
    if (!currentGame) {
      return <Redirect to="/games" replace />
    }

    const uid = user._id;
    const isOwner = currentGame.owner === user._id;
    const isAdmin = isOwner || currentGame.allowedAdmins.includes(user._id);
    const isPlayer = team.find(t => t.members.find(member => member._id === user._id))



    const { status, beginTime, endTime, autoBegin, autoEnd, joinType } = currentGame;

    const isTeam = joinType === 'team';

    const beginDate = new Date(beginTime);
    const endDate = new Date(endTime);
    const now = new Date();

    const totalMinutes = Math.round((endDate - beginDate) / 60000);

    const noticeProps = { beginDate, autoBegin, autoEnd, endDate, status };

    return (
      <div>
        <NavBar mode="light"
          rightContent={[
            isOwner ? <Link to="/gaming/edit" key="1" className="iconfont icon-edit" style={{ width: 22, marginLeft: 5 }} /> : null,
            <Link to="/gaming/detail" key="0" className="iconfont icon-info" style={{ width: 22, marginLeft: 5 }} />,
          ]}
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >当前游戏状态</NavBar>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          <MyGameNoticeBar {...noticeProps} />
        </NoticeBar>
        <List renderHeader="">
          <Item>
            {currentGame.title}<Brief>{currentGame.desc}</Brief>
          </Item>
        </List>
        <List renderHeader={'地址'}>
          <Item multipleLine>{currentGame.location}</Item>
        </List>
        <List renderHeader={'游戏时间'}>
          <Item multipleLine>
            <Badge text={getTimeStr(currentGame.beginTime)} />
            至
            <Badge text={getTimeStr(currentGame.endTime)} />
            <Brief>游戏总时长约为{totalMinutes}分钟</Brief>
          </Item>
        </List>
        <List renderHeader={'得分榜'}>
          {isTeam ? (
            team.slice().sort((a, b) => b.score - a.score).map(
              v => <Item
                key={v._id}
                arrow="horizontal"
                platform="android"
                onClick={() => this.showScoreAction(isTeam, isAdmin, v._id, v.team)}>
                <Badge overflowCount={OVERFLOW_COUNT} text={v.teamScore || '0'} />
                {v.team}({v.members.length}人){isPlayer && v._id === isPlayer._id ? '(当前队伍)' : null}

              </Item>)
          ) : (
              team[0].members.slice().sort((a, b) => b.score - a.score).map(
                v => <Item
                  key={v._id}
                  arrow="horizontal"
                  platform="android"
                  onClick={() => this.showScoreAction(isTeam, isAdmin, v._id)}>
                  <Badge overflowCount={OVERFLOW_COUNT} text={v.score || '0'} />
                  {v.nickname}
                </Item>)
            )}
        </List>
        {isAdmin ? (
          <List renderHeader={'游戏管理'}>
            {status === 'waiting' ?
              <Item>
                <Button type="primary" onClick={this.startGame}>开始游戏</Button>
              </Item> : null}
            {status === 'gaming' ?
              <Item>
                <Button type="warning" onClick={this.endGame}>结束游戏</Button>
              </Item> : null}
          </List>) : null}
        {isAdmin ? (
          <List renderHeader={'团队管理'}>
            <Item>
              <Button onClick={this.createTeam}>新增团队</Button>
            </Item>
          </List>) : null}
        {isOwner ? null : (
          <List>
            <Item>
              <Button type="warning" onClick={this.wannaExit}>退出游戏</Button>
            </Item>
          </List>
        )}
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
