import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  NavBar,
  Badge,
  Button,
  Icon,
  List,
} from 'antd-mobile';

import { getTimeStr } from '../utils/time';

const Item = List.Item;
const Brief = Item.Brief;
const Fragment = React.Fragment;

const JOIN_TYPE = {
  individual: '个人',
  team: '团队'
}

function GameDetailPage({ dispatch, match, games }) {

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
            <Item extra={<Button size="small" type="primary">加入游戏</Button>}>
              我是玩家
              <Brief>将作为玩家参与到游戏中</Brief>
            </Item>
            <Item extra={<Button size="small" type="primary">申请管理</Button>}>
              我是工作人员
              <Brief>将作为工作人员协助游戏管理</Brief>
            </Item>
          </List>
        </Fragment>)}
    </div>
  );
}

GameDetailPage.propTypes = {
};

function mapStateToProps(state) {
  return { games: state.games };
}

export default connect(mapStateToProps)(GameDetailPage);
