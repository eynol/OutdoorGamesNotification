import React from 'react';
import { connect } from 'dva';
import { TabBar } from 'antd-mobile';
import { Route, withRouter, routerRedux } from 'dva/router';


const GAME_REG = /^\/games/;
const MESSAGE_REG = /^\/messages/;
const SETTING_REG = /^\/setting/;

class TabBarExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'redTab',
    };
  }

  render() {
    const { location, dispatch } = this.props;
    const pathname = location.pathname;
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
        hidden={this.state.hidden}
        noRenderContent
      >
        <TabBar.Item
          title="游戏"
          key="games"
          icon={<div className="iconfont icon-game" />}
          selectedIcon={<div className="iconfont icon-game" />}
          selected={GAME_REG.test(pathname)}
          onPress={() => {
            dispatch(routerRedux.push({ pathname: '/games' }));
          }}
        />
        <TabBar.Item
          icon={<div className="iconfont icon-message" />}
          selectedIcon={<div className="iconfont icon-message" />}
          title="消息推送"
          key="messages"
          selected={MESSAGE_REG.test(pathname)}
          onPress={() => {
            dispatch(routerRedux.push({ pathname: '/messages' }));
          }}
        />
        <TabBar.Item
          icon={<div className="iconfont icon-setting" />}
          selectedIcon={<div className="iconfont icon-setting" />}
          title="设置"
          key="setting"
          selected={SETTING_REG.test(pathname)}
          onPress={() => {
            dispatch(routerRedux.push({ pathname: '/setting' }));
          }}
        />
      </TabBar>
    );
  }
}
export default withRouter(connect()(TabBarExample));
