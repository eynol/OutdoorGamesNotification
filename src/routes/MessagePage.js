import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';

function MessagePage() {
  return (
    <div>
      Message page
    </div>
  );
}

MessagePage.propTypes = {
};
function mapStateToProps(state) {
  return { games: state.games };
}

export default connect(mapStateToProps)(MessagePage);
