import React from 'react';
import { connect } from 'dva';
import { Route } from 'dva/router';

function IndexPage() {
  return (
    <div>
      setting page
    </div>
  );
}

IndexPage.propTypes = {
};

export default connect()(IndexPage);
