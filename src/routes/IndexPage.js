import React from 'react';
import { connect } from 'dva';
import { Route, Link } from 'dva/router';
import {
  NavBar, Icon, WhiteSpace,
  List,
} from 'antd-mobile';


const Item = List.Item;
const Brief = Item.Brief;

function IndexPage() {
  return (
    <div>
      <NavBar mode="light"
        onLeftClick={() => console.log('onLeftClick')}
        rightContent={[
          <Link to="/games/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />,
        ]}
      >所有游戏</NavBar>

      <List className="my-list">
        <Item
          arrow="horizontal"
          multipleLine
          onClick={() => { }}
          platform="android"
        >
          Title <Brief>subtitle</Brief>
        </Item>
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

IndexPage.propTypes = {
};

function mapStateToProps(state) {
  return { count: state.count };
}

export default connect(mapStateToProps)(IndexPage);
