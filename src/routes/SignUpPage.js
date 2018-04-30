import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  Button,
  WhiteSpace,
  WingBlank,
  Toast,
} from 'antd-mobile';
import { createForm } from 'rc-form';


class SignUpForm extends React.Component {
  // constructor(props){
  //   super(props);
  // }
  submit = () => {

    const { dispatch } = this.props;

    this.props.form.validateFields((error, values) => {
      if (error) {
        let messages = Object.keys(error).map((key => {
          return error[key].errors.map(err => {
            return err.message;
          }).join('\n')
        })).join('\n');

        Toast.fail(<div style={{ whiteSpace: 'pre' }}>{messages}</div>, 2);
      } else if (values.password !== values.password2) {
        Toast.fail(<div style={{ whiteSpace: 'pre' }}>两次密码不一致</div>, 2);
      } else {
        delete values.password2;
        dispatch({
          type: 'user/signup',
          payload: values
        });
      }
    });
  }
  render() {
    const { dispatch } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className="frame">
        <NavBar mode="light"
          className="o-navbar"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >注册</NavBar>
        <div className="content">
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
            <InputItem
              {...getFieldProps('username', {
                rules: [
                  { required: true, message: '用户名不能为空' },
                  { max: 23, message: '用户名长度不能超过23位' }
                ],
              }) }
              clear
              placeholder="请输入您的用户名"
              ref={el => this.username = el}
            >用户名</InputItem>
            <InputItem
              {...getFieldProps('password', {
                rules: [
                  { required: true, message: '密码不能为空' },
                  { max: 23, message: '密码长度不能超过23位' }
                ],
              }) }
              type="password"
              clear
              placeholder="请输入密码"
            >密码</InputItem>
            <InputItem
              {...getFieldProps('password2', {
                rules: [
                  { required: true, message: '密码不能为空' },
                  { max: 23, message: '密码长度不能超过23位' }
                ],
              }) }
              type="password"
              clear
              placeholder="请二次确认您的密码"
            >请确认密码</InputItem>
          </List>
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onClick={this.submit}>立即注册</Button>
          </WingBlank>
        </div>
      </div>
    );
  }
}



function mapStateToProps(state) {
  return { messages: state.messages };
}


const SignUpFormWrapper = createForm()(SignUpForm);
export default connect(mapStateToProps)(SignUpFormWrapper);
