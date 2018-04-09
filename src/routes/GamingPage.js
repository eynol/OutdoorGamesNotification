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



  render() {
    const { dispatch, games } = this.props;
    const currentGame = games.currentGame;

    return (
      <div>
        <NavBar mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >当前游戏状态</NavBar>

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
