import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  List,
  WingBlank,
  WhiteSpace,
} from 'antd-mobile';


const Item = List.Item;
const Brief = Item.Brief;


const GAME_STATUS = { waiting: '游戏准备中', gaming: '游戏已经开始', finished: '游戏已经结束' };


class GamesPage extends React.Component {
  render() {
    const { games } = this.props;
    var list = games.list || [];


    return (
      <div className="frame">
        <NavBar mode="light"
          className="o-navbar"
          rightContent={[
            <Link to="/games/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />,
          ]}
        >所有游戏</NavBar>
        <div className="content">
          <List className="my-list">
            {list.length ? list.map((game) => {
              return (<Item
                key={game._id}
                arrow="horizontal"
                multipleLine
                onClick={() => { }}
                platform="android"
              >
                <Link to={`/games/detail/${game._id}`}>
                  {game.title}<Brief>{game.desc}</Brief>
                  <Brief>{game.location}</Brief>
                  <Brief>{GAME_STATUS[game.status]}</Brief>
                </Link>
              </Item>);
            })
              : (<WingBlank><WhiteSpace /><p>当前暂无游戏，请先创建游戏</p><WhiteSpace /></WingBlank>)
            }
          </List>
        </div>
      </div>
    );
  }
}
GamesPage.propTypes = {

};

function mapStateToProps(state) {
  return { games: state.games };
}

export default connect(mapStateToProps)(GamesPage);
