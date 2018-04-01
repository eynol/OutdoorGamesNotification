import React from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import {
  NavBar, Icon,

} from 'antd-mobile';


function IndexPage({ dispatch }) {
  return (
    <div>
      <NavBar mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => dispatch(routerRedux.go(-1))}
      >新建游戏</NavBar>

    </div>
  );
}

IndexPage.propTypes = {
};

function mapStateToProps(state) {
  return { count: state.count };
}

export default connect(mapStateToProps)(IndexPage);
