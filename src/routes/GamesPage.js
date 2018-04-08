import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
  List,
} from 'antd-mobile';


const Item = List.Item;
const Brief = Item.Brief;

class GamesPage extends React.Component {
  render() {
    const { games } = this.props;
    var list = games.list || [];


    return (
      <div>
        <NavBar mode="light"
          rightContent={[
            <Link to="/games/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />,
          ]}
        >所有游戏</NavBar>

        <List className="my-list">
          {list.map((game) => {
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
                <Brief>游戏准备中</Brief>
              </Link>
            </Item>);
          })}
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => { }}
            platform="android"
          >
            多益网络户外游戏Running Man （团队）<Brief>There may have water ripple effect of <br /> material if you set the click event.</Brief>
            <Brief>重庆市南岸区崇文路2号</Brief>
            <Brief>游戏准备中</Brief>
          </Item>
          <Item
            arrow="horizontal"
            multipleLine
            onClick={() => { }}
            platform="android"
          >
            Title <Brief>subtitle</Brief>
          </Item>
        </List>
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
