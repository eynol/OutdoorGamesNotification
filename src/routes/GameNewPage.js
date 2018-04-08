import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  NavBar,
  Icon,
  List,
  InputItem,
} from 'antd-mobile';

import { createForm } from 'rc-form';

function NewGamePage({ dispatch ,form}) {
  const { getFieldProps } = form;
  return (
    <div>
      <NavBar mode="light"
        icon={<Icon type="left" />}
        onLeftClick={() => dispatch(routerRedux.go(-1))}
      >新建游戏</NavBar>
      <List>
          <InputItem
            {...getFieldProps('nickname', {
              rules: [
                { required: true, message: '昵称不能为空' },
                { max: 10, message: '昵称长度不能超过23位' }
              ],
            }) }
            clear
            placeholder="请输入您的昵称"
            ref={el => this.username = el}
          >昵称</InputItem>
          </List>
    </div>
  );
}

NewGamePage.propTypes = {
};

function mapStateToProps(state) {
  return { count: state.count };
}

const NewGameFormWrapper = createForm()(NewGamePage);

export default connect(mapStateToProps)(NewGameFormWrapper);
