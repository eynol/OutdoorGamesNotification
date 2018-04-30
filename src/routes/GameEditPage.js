import React from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
  NavBar,
  Icon,
  List,
  InputItem,
  TextareaItem,
  DatePicker,
  Switch,
  Radio,
  Button,
  WingBlank,
  Toast,
  WhiteSpace,
  Modal,
} from 'antd-mobile';

import { createForm } from 'rc-form';

import styles from './GameNewPage.css';

const RadioItem = Radio.RadioItem;
const Fragment = React.Fragment;
const JOIN_TYPE = [{ text: '个人参赛', value: 'individual' }, { text: '团队参赛', value: 'team' }]

class NewGamePage extends React.Component {
  state = {
    dpValue: new Date(),
    joinType: null,
  }
  deleteGame = () => {
    const { dispatch, games, user } = this.props;
    const { currentGame } = games;
    const gid = currentGame._id;
    const uid = user._id;

    Modal.alert('确定删除游戏？', '', [
      { text: '取消' },
      {
        text: '确定', onPress: () => {
          dispatch({ type: 'games/deleteGame', payload: { gid, uid } });
        }
      },
    ])
  }
  submit = () => {
    const { dispatch, form, user, games } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        //检查时间
        const now = new Date();

        const beginTime = values.beginTime;
        const endTime = values.endTime;

        const isLargeThan30Day = (endTime - beginTime) > (1000 * 60 * 60 * 24 * 30);
        const isWaitMoreThan60Day = (beginTime - now) > (1000 * 60 * 60 * 24 * 60);

        if (now >= beginTime) {
          Toast.fail('游戏开始时间不能在过去');
        } else if (isWaitMoreThan60Day) {
          Toast.fail('游戏开始时间距离现在不能超过60天');
        } else if (beginTime >= endTime) {
          Toast.fail('游戏开始时间不能在结束时间以后');
        } else if (now >= endTime) {
          Toast.fail('游戏结束时间不能在过去');
        } else if (isLargeThan30Day) {
          Toast.fail('游戏总时长不能超过30天');
        } else {

          //diff todo;
          const { currentGame } = games;

          const data = {};
          for (var key in values) {
            if (values[key] !== currentGame[key]) {
              if (['beginTime', 'endTime'].includes(key)) {
                const oldValue = new Date(currentGame[key]);
                if (values[key].getTime() !== oldValue.getTime()) {
                  data[key] = values[key];
                }
              } else {
                data[key] = values[key];
              }
            }
          }

          if (Object.keys(data).length) {
            console.log('changed', data);
            dispatch({
              type: 'games/updateGame',
              payload: {
                uid: user._id,
                gid: currentGame._id,
                ...data,
              }
            })
          } else {
            //没有任何改变
            dispatch(routerRedux.go(-1));
          }



        }
      } else {

        let messages = Object.keys(error).map((key => {
          return error[key].errors.map(err => {
            return err.message;
          }).join('\n')
        })).join('\n');

        Toast.fail(<div style={{ whiteSpace: 'pre' }}>{messages}</div>, 2);
      }
    });
  }
  ChangeJoinType = (joinType) => {
    this.setState({ joinType })
  }
  validateDatePicker = (rule, date, callback) => {
    console.log(rule, date, callback);
    if (date && date.getMinutes() !== 15) {
      callback();
    } else {
      callback(new Error('15 is invalid'));
    }
  }

  render() {
    const { dispatch, form, user, games } = this.props;
    const { getFieldProps } = form;
    const { currentGame } = games;
    return (
      <div>
        <NavBar mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => dispatch(routerRedux.go(-1))}
        >修改信息</NavBar>
        {user.online ? (
          <Fragment>
            <List className={styles.datemore}>
              <InputItem
                {...getFieldProps('title', {
                  initialValue: currentGame.title,
                  rules: [
                    { required: true, message: '标题不能为空' },
                    { max: 120, message: '游戏标题长度不能超过120个字符' }
                  ],
                }) }
                clear
                placeholder="请输入游戏标题"
              >游戏标题</InputItem>
              <TextareaItem
                {...getFieldProps('desc', {
                  initialValue: currentGame.desc,
                  rules: [
                    { required: true, message: '游戏描述不能为空' },
                    { max: 500, message: '游戏描述长度不能超过500个字符' }
                  ],
                }) }
                rows="3"
                title="游戏描述"
                autoHeight
                placeholder="请输入游戏描述"
              />
              <InputItem
                {...getFieldProps('location', {
                  initialValue: currentGame.location,
                  rules: [
                    { required: true, message: '游戏地点不能为空' },
                    { max: 50, message: '游戏地点长度不能超过50个字符' }
                  ],
                }) }
                clear
                placeholder="请输入游戏地点"
              >游戏地点</InputItem>
              <TextareaItem
                {...getFieldProps('rules', {
                  initialValue: currentGame.rules,
                  rules: [
                    { required: true, message: '游戏规则不能为空' },
                    { max: 2000, message: '游戏规则长度不能超过2000个字符' }
                  ],
                }) }

                title="游戏规则"
                autoHeight
                rows="3"
                placeholder="请输入游戏规则"
              />
              <DatePicker
                disabled={currentGame.status !== 'waiting'}
                {...getFieldProps('beginTime', {
                  initialValue: new Date(currentGame.beginTime),
                  rules: [
                    { required: true, message: '必须选择一个时间' },
                    { validator: this.validateDatePicker },
                  ],
                }) }
                title="开始时间"
                extra="请选择"
                mode="datetime"
              ><List.Item arrow="horizontal">开始时间</List.Item></DatePicker>
              <List.Item
                extra={<Switch
                  disabled={currentGame.status !== 'waiting'}
                  {...getFieldProps('autoBegin', {
                    initialValue: currentGame.autoBegin,
                    valuePropName: 'checked',
                  }) }
                />}
              >自动开始</List.Item>
              <DatePicker
                disabled={currentGame.status !== 'waiting'}
                {...getFieldProps('endTime', {
                  initialValue: new Date(currentGame.endTime),
                  rules: [
                    { required: true, message: '必须选择一个时间' },
                    { validator: this.validateDatePicker },
                  ],
                }) }
                title="结束时间"
                extra="请选择"
                mode="datetime"
              ><List.Item arrow="horizontal">结束时间</List.Item></DatePicker>
              <List.Item

                extra={<Switch
                  {...getFieldProps('autoEnd', {
                    initialValue: currentGame.autoEnd,
                    valuePropName: 'checked',
                  }) }
                />}
              >自动结束</List.Item>
              <TextareaItem
                {...getFieldProps('additions', {
                  initialValue: currentGame.additions,
                  rules: [
                    { required: true, message: '备注不能为空' },
                    { max: 500, message: '备注长度不能超过500个字符' }
                  ],
                }) }
                rows="3"
                title="备注"
                autoHeight
                placeholder="请输入备注"
              />
            </List>
            <List renderHeader={() => '参赛类型(不可更改)'}>
              {JOIN_TYPE.map(i => (
                <RadioItem
                  key={i.value}
                  checked={currentGame.joinType === i.value}>
                  {i.text}
                </RadioItem>
              ))}
            </List>
            <WhiteSpace />
            <WhiteSpace />
            <List>
              <List.Item>
                <Button type="primary" onClick={this.submit}>保存</Button>
              </List.Item>
              <List.Item>
                <Button type="warning" onClick={this.deleteGame}>删除游戏</Button>
              </List.Item>
            </List>
            <WhiteSpace />
            <WhiteSpace />
          </Fragment>)
          : (
            <Fragment key="needSignin">
              <WingBlank><p>创建游戏需要登录账户，请先登录</p></WingBlank>
              <WingBlank><Link to="/setting"><Button>前往登录</Button></Link></WingBlank>
            </Fragment>
          )}

      </div>
    );
  }
}

NewGamePage.propTypes = {
};

function mapStateToProps(state) {
  return { user: state.user, games: state.games };
}

const NewGameFormWrapper = createForm()(NewGamePage);

export default connect(mapStateToProps)(NewGameFormWrapper);
