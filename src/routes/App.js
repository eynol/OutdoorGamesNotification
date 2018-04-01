import React from 'react';
import { connect } from 'dva';
import { Route, Redirect } from 'dva/router';
import styles from './App.css';
import AppBar from '../components/AppBar';

import IndexPage from './IndexPage';
import MessagePage from './MessagePage';
import SettingPage from './SettingPage';

import GameNewPage from './GameNewPage';

function MainPage() {
  return (
    <div className={styles.frame}>
      <div className={styles.content}>
        <Route path="/" exact render={() => <Redirect from="/" to="/games" />} />
        <Route path="/games" exact component={IndexPage} />
        <Route path="/games/new" exact component={GameNewPage} />
        <Route path="/messages" exact component={MessagePage} />
        <Route path="/setting" exact component={SettingPage} />
      </div>
      <div className={styles.appbar}>
        <AppBar />
      </div>
    </div>
  );
}



export default connect()(MainPage);
