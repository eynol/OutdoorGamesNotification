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


class SignInForm extends React.Component {
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
      } else {
        dispatch({
          type: 'user/signin',
          payload: values
        })
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
        >登录</NavBar>
        <div className="content">
          <List>
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
                  { max: 23, message: '用户名长度不能超过23位' }
                ],
              }) }
              type="password"
              clear
              placeholder="请输入密码"
            >密码</InputItem>
          </List>
          <WhiteSpace />
          <WingBlank>
            <Button type="primary" onClick={this.submit}>立即登录</Button>
          </WingBlank>
        </div>
      </div>
    );
  }
}



function mapStateToProps(state) {
  return { messages: state.messages };
}


const SignInFormWrapper = createForm()(SignInForm);
export default connect(mapStateToProps)(SignInFormWrapper);
