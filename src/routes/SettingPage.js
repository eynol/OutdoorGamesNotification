import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Modal,
  NavBar,
  List,
  WingBlank, WhiteSpace,
  Button,
  Toast,
} from 'antd-mobile';

const Fragment = React.Fragment;
const Item = List.Item;


function SettingPage({ user, dispatch }) {
  return (
    <div className="frame">
      <NavBar mode="light"
        className="o-navbar"
      >设置</NavBar>
      <div className="content">
        {user.online ? (
          <Fragment>
            <List renderHeader="基本资料">
              <Item>{user.nickname}</Item>
            </List>
            <List renderHeader="操作">
              <Item><Button type="primary" onClick={() => {
                Modal.prompt('修改昵称', '编辑昵称', [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定修改',
                    onPress: value => new Promise((resolve, reject) => {
                      if (value.trim()) {
                        dispatch({ type: 'user/updatenickname', payload: value, resolve, reject })
                      } else {
                        Toast.fail('昵称不能为空');
                        reject('昵称不能为空');
                      }
                    }),
                  },
                ], 'default', user.nickname, ['请输入昵称'])
              }}>修改昵称</Button></Item>
              <Item><Button type="primary" onClick={() => {
                Modal.prompt('修改密码', '修改密码', [
                  {
                    text: '取消',
                  },
                  {
                    text: '确定修改',
                    onPress: value => new Promise((resolve, reject) => {
                      value = value.trim()
                      if (value) {
                        if (value.length > 257) {
                          Toast.fail('密码长度不能超过256位')
                        } else {
                          dispatch({ type: 'user/updatepassword', payload: value, resolve, reject })
                        }
                      } else {
                        Toast.fail('密码不能为空');
                        reject('密码不能为空');
                      }
                    }),
                  },
                ], "default", '', ['请输入密码'])
              }}>修改密码</Button></Item>
              <Item><Button type="danger" onClick={() => dispatch({ type: 'user/signout' })}>退出登录</Button></Item>
            </List>
          </Fragment>
        )
          : (
            <div>
              <WingBlank>
                <p>账户未登录,请选择下列操作</p>
              </WingBlank>
              <WingBlank>
                <Link to="/signin"><Button type="primary">登录</Button></Link>
              </WingBlank>
              <WhiteSpace />
              <WingBlank>
                <Link to="/signup"><Button>注册</Button></Link>
              </WingBlank>

            </div>
          )}
      </div>
    </div>
  );
}

SettingPage.propTypes = {
};

function mapStateToProps(state) {
  return { user: state.user }
}

export default connect(mapStateToProps)(SettingPage);
