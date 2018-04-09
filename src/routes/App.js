import React from 'react';
import { connect } from 'dva';
import { Route, Redirect } from 'dva/router';
import styles from './App.css';
import AppBar from '../components/AppBar';

import GamesPage from './GamesPage';
import MessagePage from './MessagePage';
import SettingPage from './SettingPage';

import GameNewPage from './GameNewPage';
import GameDetailPage from './GameDetailPage';

import TeamChoose from './TeamChoose';
import TeamManage from './TeamManage';

import GamingPage from './GamingPage';

import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';

import { ActivityIndicator } from 'antd-mobile';


function App({ loading ,ui}) {
  return (
    <div className={styles.frame}>
      <ActivityIndicator
        toast
        text="Loading..."
        animating={loading}
      />
      <div className={styles.content}>
        <Route path="/" exact render={() => <Redirect from="/" to="/games" />} />
        <Route path="/games" exact component={GamesPage} />
        <Route path="/games/new" exact component={GameNewPage} />
        <Route path="/games/detail/:gid" exact component={GameDetailPage} />
        <Route path="/messages" exact component={MessagePage} />
        <Route path="/chooseteam" exact component={TeamChoose} />
        <Route path="/gaming" exact component={GamingPage} />
        <Route path="/gaming/team" exact component={TeamManage} />
        <Route path="/setting" exact component={SettingPage} />
        <Route path="/signin" exact component={SignInPage} />
        <Route path="/signup" exact component={SignUpPage} />
      </div>
      {ui.appbar?(
        <div className={styles.appbar}>
        <AppBar />
      </div>)
      :null}

    </div>
  );
}

function mapStateToProps(state) {

  return {
    loading: state.loading.global,
    ui:state.ui,
  }
}

export default connect(mapStateToProps)(App);
