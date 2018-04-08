import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  NavBar,
  Icon,
} from 'antd-mobile';


function MessageNewPage({ dispatch }) {
  return (
    <div>
      <NavBar mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => dispatch(routerRedux.go(-1))}
      >新建推送信息</NavBar>
    </div>
  );
}

MessageNewPage.propTypes = {
};
function mapStateToProps(state) {
  return { messages: state.messages };
}

export default connect(mapStateToProps)(MessageNewPage);
