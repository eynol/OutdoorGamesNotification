import React from 'react';
import { connect } from 'dva';
import { routerRedux, Redirect } from 'dva/router';
import {
  NavBar,
  Button,
  List,
  Radio,
  WingBlank,
  WhiteSpace,
} from 'antd-mobile';

const Item = List.Item;
const Fragment = React.Fragment;
const RadioItem = Radio.RadioItem;


class TeamChoose extends React.Component {

  state = {
    team: null,
  }
  chooseTeam = (team) => {
    this.setState({ team })
  }
  submit = () => {

    const { dispatch, games, user } = this.props;
    const gid = games.currentGame._id;
    const uid = user._id;
    const teamid = this.state.team;
    dispatch({ type: 'games/joinGame', payload: { gid, uid, teamid } });
  }
  refresh = () => {
    const { dispatch, games } = this.props;
    dispatch({ type: 'games/getJoinList', payload: games.currentGame._id })
  }
  render() {
    const { games, location } = this.props;
    const { team, currentGame } = games;

    const { tempUser } = location.state || {};;

    if (!currentGame) {
      return (<Redirect replace from="/chooseteam" to="/games" />)
    }
    return (
      <div>
        <NavBar mode="light"
        >选择游戏团队</NavBar>
        {currentGame && (
          <Fragment>
            <List renderHeader={'请从下方选择一个团队'}>
              {team && team.length ? (
                <Fragment>
                  {team.map(
                    (joinList, index) => <RadioItem
                      key={joinList._id}
                      checked={this.state.team === joinList._id}
                      onChange={()=>this.chooseTeam(joinList._id)}
                    >{joinList.team}</RadioItem>)}
                  <WhiteSpace />
                  <WingBlank><Button type="primary" onClick={this.submit} disabled={!this.state.team}>加入该团队</Button></WingBlank>
                  <WhiteSpace />
                  <WingBlank><Button onClick={this.refresh}>刷新</Button></WingBlank>
                  <WhiteSpace />
                </Fragment>
              ) : (
                  <Button onClick={this.refresh}>刷新</Button>
                )}
            </List>
          </Fragment>)
        }
      </div>
    );
  }

}

TeamChoose.propTypes = {
};

function mapStateToProps(state) {
  return { games: state.games, user: state.user };
}

export default connect(mapStateToProps)(TeamChoose);
