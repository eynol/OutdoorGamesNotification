import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  NavBar,
} from 'antd-mobile';


function MessagePage() {
  return (
    <div>
      <NavBar mode="light"
        rightContent={[
          <Link to="/messages/new" key="0" className="iconfont icon-27CIRCLE" style={{ width: 22 }} />,
        ]}
      >推送信息</NavBar>
    </div>
  );
}

MessagePage.propTypes = {
};
function mapStateToProps(state) {
  return { messages: state.messages };
}

export default connect(mapStateToProps)(MessagePage);
