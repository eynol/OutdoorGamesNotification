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

  }
  refresh = () => {

  }
  render() {
    const { dispatch, games } = this.props;
    const currentGame = games.currentGame;
    if (!currentGame) {
      return (<Redirect replace from="/chooseteam" to="/games" />)
    }
    return (
      <div>
        <NavBar mode="light"
        >选择游戏团队</NavBar>
        {currentGame && (
          <Fragment>
            <List renderHeader={'只能选择一个团队'}>
              {currentGame.teams && currentGame.teams.length ? (
                <Fragment>
                  {currentGame.teams.map(
                    (team, index) => <RadioItem
                      key={team}
                      checked={this.state.team === team}
                      onChange={() => this.chooseTeam(team)}
                    >{team}</RadioItem>)}
                  <WhiteSpace />
                  <WingBlank><Button type="primary">加入该团队</Button></WingBlank>
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
